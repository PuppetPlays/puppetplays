import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import styles from './TranscriptionPDFDownload.module.scss';

/**
 * Composant pour télécharger une transcription complète en PDF
 * Utilise jsPDF pour générer le PDF côté client avec toutes les pages
 */
const TranscriptionPDFDownload = ({
  transcriptionPages = [],
  title = 'Transcription',
  anthologyTitle = '',
}) => {
  const { t } = useTranslation(['anthology', 'common']);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Nettoie et normalise le texte en supprimant les retours à la ligne indésirables
   * et en préservant l'espacement correct
   */
  const cleanText = useCallback(text => {
    if (!text) return '';

    return text
      .replace(/\r\n/g, '\n') // Normalise les retours à la ligne Windows
      .replace(/\r/g, '\n') // Normalise les retours à la ligne Mac
      .replace(/\n\s+/g, ' ') // Remplace retour à la ligne + espaces par un seul espace
      .replace(/\s+\n/g, ' ') // Remplace espaces + retour à la ligne par un seul espace
      .replace(/\n/g, ' ') // Remplace tous les retours à la ligne restants par des espaces
      .replace(/\s{2,}/g, ' ') // Remplace les espaces multiples par un seul espace
      .replace(/([.!?])\s*([A-ZÀ-Ÿ])/g, '$1 $2') // Assure un espace après la ponctuation
      .replace(/([,;:])\s*/g, '$1 ') // Assure un espace après les virgules, points-virgules, deux-points
      .trim(); // Supprime les espaces en début et fin
  }, []);

  /**
   * Convertit le contenu de transcription en texte formaté pour le PDF
   */
  const formatContentForPDF = useCallback(
    content => {
      const lines = [];

      content.forEach(item => {
        switch (item.type) {
          case 'author':
            lines.push({ text: cleanText(item.content), style: 'author' });
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'title':
            lines.push({ text: cleanText(item.content), style: 'title' });
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'subtitle':
            lines.push({ text: cleanText(item.content), style: 'subtitle' });
            break;
          case 'date':
            lines.push({ text: cleanText(item.content), style: 'date' });
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'heading':
            lines.push({ text: '', style: 'spacing' });
            lines.push({ text: cleanText(item.content), style: 'heading' });
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'sceneHeading':
            lines.push({ text: '', style: 'spacing' });
            lines.push({
              text: cleanText(item.content),
              style: 'sceneHeading',
            });
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'speaker':
            lines.push({ text: '', style: 'spacing' });
            lines.push({ text: cleanText(item.content), style: 'speaker' });
            break;
          case 'text':
            lines.push({ text: cleanText(item.content), style: 'dialogue' });
            break;
          case 'dialogue':
            if (Array.isArray(item.content)) {
              item.content.forEach(line => {
                lines.push({ text: cleanText(line), style: 'dialogue' });
              });
            } else {
              lines.push({ text: cleanText(item.content), style: 'dialogue' });
            }
            break;
          case 'stage':
            lines.push({
              text: `[${cleanText(item.content)}]`,
              style: 'stage',
            });
            break;
          case 'castList':
            if (Array.isArray(item.content)) {
              item.content.forEach(role => {
                const roleText = role.fullText || role;
                lines.push({ text: cleanText(roleText), style: 'cast' });
              });
            }
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'sceneCharacters':
            if (Array.isArray(item.content)) {
              item.content.forEach(chars => {
                lines.push({
                  text: cleanText(chars),
                  style: 'sceneCharacters',
                });
              });
            } else {
              lines.push({
                text: cleanText(item.content),
                style: 'sceneCharacters',
              });
            }
            lines.push({ text: '', style: 'spacing' });
            break;
          case 'verse':
            if (Array.isArray(item.content)) {
              item.content.forEach(line => {
                lines.push({ text: cleanText(line), style: 'verse' });
              });
            }
            break;
          default:
            if (item.content) {
              lines.push({ text: cleanText(item.content), style: 'normal' });
            }
        }
      });

      return lines;
    },
    [cleanText],
  );

  /**
   * Génère et télécharge le PDF
   */
  const generatePDF = useCallback(async () => {
    if (!transcriptionPages || transcriptionPages.length === 0) {
      console.error('No transcription pages available');
      return;
    }

    setIsGenerating(true);

    try {
      // Créer un nouveau document PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Configuration des polices et marges
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginLeft = 25;
      const marginRight = 25;
      const marginTop = 30;
      const marginBottom = 25;
      const contentWidth = pageWidth - marginLeft - marginRight;
      let currentY = marginTop;

      // En-tête professionnel avec couleurs du projet
      // Bande bleue en haut
      pdf.setFillColor(30, 58, 138); // Bleu du projet
      pdf.rect(0, 0, pageWidth, 40, 'F');

      // Logo/Titre du projet
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(255, 255, 255); // Blanc
      pdf.text('PuppetPlays', marginLeft, 20);

      // Titre du document
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(255, 255, 255); // Blanc
      const mainTitle = anthologyTitle || title;
      const shortTitle =
        mainTitle.length > 50 ? mainTitle.substring(0, 47) + '...' : mainTitle;
      pdf.text(shortTitle, marginLeft, 30);

      // Date de génération
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      const today = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pdf.text(today, pageWidth - marginRight - 40, 30);

      currentY = 55;

      // Titre complet du document
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(30, 58, 138); // Bleu
      const titleLines = pdf.splitTextToSize(mainTitle, contentWidth);
      pdf.text(titleLines, marginLeft, currentY);
      currentY += titleLines.length * 8 + 5;

      // Sous-titre
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'italic');
      pdf.setTextColor(107, 114, 128); // Gris
      pdf.text('Transcription complète du manuscrit', marginLeft, currentY);
      currentY += 10;

      // Ligne de séparation
      pdf.setDrawColor(220, 220, 220); // Gris clair
      pdf.setLineWidth(0.5);
      pdf.line(marginLeft, currentY, pageWidth - marginRight, currentY);
      currentY += 10;

      // Remettre la couleur du texte en noir pour le contenu
      pdf.setTextColor(0, 0, 0);

      // Styles pour différents types de contenu avec espacement optimisé
      const styles = {
        author: {
          fontSize: 14,
          fontStyle: 'bold',
          spacing: 7,
          extraSpacing: 2,
        },
        title: { fontSize: 16, fontStyle: 'bold', spacing: 8, extraSpacing: 3 },
        subtitle: {
          fontSize: 13,
          fontStyle: 'italic',
          spacing: 6,
          extraSpacing: 2,
        },
        date: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 5,
          extraSpacing: 1,
        },
        heading: {
          fontSize: 14,
          fontStyle: 'bold',
          spacing: 7,
          extraSpacing: 2,
        },
        sceneHeading: {
          fontSize: 13,
          fontStyle: 'bold',
          spacing: 7,
          extraSpacing: 2,
        },
        speaker: {
          fontSize: 12,
          fontStyle: 'bold',
          spacing: 5,
          extraSpacing: 1,
        },
        text: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 5,
          extraSpacing: 0,
        },
        dialogue: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 5,
          extraSpacing: 0,
        },
        stage: {
          fontSize: 10,
          fontStyle: 'italic',
          spacing: 4,
          extraSpacing: 1,
        },
        cast: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 4,
          extraSpacing: 0,
        },
        sceneCharacters: {
          fontSize: 11,
          fontStyle: 'italic',
          spacing: 4,
          extraSpacing: 1,
        },
        verse: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 4,
          extraSpacing: 0,
        },
        normal: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 5,
          extraSpacing: 0,
        },
        spacing: {
          fontSize: 11,
          fontStyle: 'normal',
          spacing: 3,
          extraSpacing: 0,
        },
      };

      // Traiter TOUTES les pages de transcription
      const pagesToProcess = transcriptionPages;

      // Parcourir toutes les pages de transcription
      pagesToProcess.forEach((page, pageIndex) => {
        if (pageIndex > 0) {
          pdf.addPage();
          currentY = marginTop;
        }

        // Formater et ajouter le contenu directement sans numéro de page
        const formattedContent = formatContentForPDF(page.content);

        formattedContent.forEach((line, index) => {
          const style = styles[line.style] || styles.normal;
          const nextLine = formattedContent[index + 1];

          // Vérifier si on a besoin d'une nouvelle page
          if (
            currentY + style.spacing + (style.extraSpacing || 0) >
            pageHeight - marginBottom
          ) {
            pdf.addPage();
            currentY = marginTop;
          }

          // Appliquer le style
          pdf.setFontSize(style.fontSize);
          pdf.setFont(undefined, style.fontStyle);

          // Diviser le texte si nécessaire et gérer les mots coupés
          if (line.text) {
            const textLines = pdf.splitTextToSize(line.text, contentWidth);

            // Ajouter le texte
            pdf.text(textLines, marginLeft, currentY);
            currentY += textLines.length * style.spacing;

            // Ajouter un espacement supplémentaire selon le type
            if (style.extraSpacing) {
              currentY += style.extraSpacing;
            }

            // Ajouter un espacement supplémentaire entre différents types d'éléments
            if (nextLine && nextLine.style !== line.style) {
              // Espacement réduit entre différents types (speaker -> dialogue, stage -> speaker, etc.)
              if (
                (line.style === 'speaker' && nextLine.style === 'text') ||
                (line.style === 'speaker' && nextLine.style === 'dialogue') ||
                (line.style === 'stage' && nextLine.style === 'speaker') ||
                (line.style === 'text' && nextLine.style === 'speaker') ||
                (line.style === 'dialogue' && nextLine.style === 'speaker')
              ) {
                currentY += 1; // Réduit de 2 à 1
              }
            }
          } else {
            // Ligne vide pour l'espacement
            currentY += style.spacing;
          }
        });
      });

      // Ajouter les numéros de page et pied de page
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Pied de page avec bande bleue
        pdf.setFillColor(245, 245, 245); // Gris très clair
        pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');

        // Ligne de séparation
        pdf.setDrawColor(30, 58, 138); // Bleu
        pdf.setLineWidth(1);
        pdf.line(0, pageHeight - 20, pageWidth, pageHeight - 20);

        // Texte "PuppetPlays" à gauche
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(107, 114, 128); // Gris
        pdf.text('PuppetPlays - Transcription', marginLeft, pageHeight - 10);

        // Numéro de page à droite
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(30, 58, 138); // Bleu
        pdf.text(
          `Page ${i} / ${totalPages}`,
          pageWidth - marginRight - 20,
          pageHeight - 10,
        );
      }

      // Télécharger le PDF
      const fileName = `${anthologyTitle || title}_transcription.pdf`.replace(
        /[^a-z0-9_\-\.]/gi,
        '_',
      );
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('anthology:pdfGenerationError'));
    } finally {
      setIsGenerating(false);
    }
  }, [transcriptionPages, title, anthologyTitle, formatContentForPDF, t]);

  // Si pas de transcription, ne pas afficher le bouton
  if (!transcriptionPages || transcriptionPages.length === 0) {
    return null;
  }

  return (
    <button
      className={`${styles.downloadButton} ${isGenerating ? styles.generating : ''}`}
      onClick={generatePDF}
      disabled={isGenerating}
      title={t('anthology:downloadFullPDF')}
    >
      {isGenerating ? (
        <>
          <svg
            className={styles.loadingIcon}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>{t('anthology:generatingPDF')}</span>
        </>
      ) : (
        <>
          <svg
            className={styles.downloadIcon}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>PDF</span>
        </>
      )}
    </button>
  );
};

TranscriptionPDFDownload.propTypes = {
  transcriptionPages: PropTypes.arrayOf(
    PropTypes.shape({
      pageNumber: PropTypes.number,
      content: PropTypes.array,
    }),
  ),
  title: PropTypes.string,
  anthologyTitle: PropTypes.string,
};

export default TranscriptionPDFDownload;
