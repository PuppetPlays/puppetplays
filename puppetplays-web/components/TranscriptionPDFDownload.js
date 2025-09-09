import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import styles from './TranscriptionPDFDownload.module.scss';

/**
 * Composant pour télécharger une transcription complète en PDF
 * Utilise jsPDF pour générer le PDF côté client avec toutes les pages
 */
const TranscriptionPDFDownload = ({ 
  transcriptionPages = [], 
  title = 'Transcription',
  anthologyTitle = ''
}) => {
  const { t } = useTranslation(['anthology', 'common']);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Convertit le contenu de transcription en texte formaté pour le PDF
   */
  const formatContentForPDF = useCallback((content) => {
    const lines = [];
    
    content.forEach(item => {
      switch (item.type) {
        case 'author':
          lines.push({ text: item.content, style: 'author' });
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'title':
          lines.push({ text: item.content, style: 'title' });
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'subtitle':
          lines.push({ text: item.content, style: 'subtitle' });
          break;
        case 'date':
          lines.push({ text: item.content, style: 'date' });
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'heading':
          lines.push({ text: '', style: 'spacing' });
          lines.push({ text: item.content, style: 'heading' });
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'sceneHeading':
          lines.push({ text: '', style: 'spacing' });
          lines.push({ text: item.content, style: 'sceneHeading' });
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'speaker':
          lines.push({ text: '', style: 'spacing' });
          lines.push({ text: item.content, style: 'speaker' });
          break;
        case 'dialogue':
          if (Array.isArray(item.content)) {
            item.content.forEach(line => {
              lines.push({ text: line, style: 'dialogue' });
            });
          } else {
            lines.push({ text: item.content, style: 'dialogue' });
          }
          break;
        case 'stage':
          lines.push({ text: `[${item.content}]`, style: 'stage' });
          break;
        case 'castList':
          if (Array.isArray(item.content)) {
            item.content.forEach(role => {
              lines.push({ text: role.fullText || role, style: 'cast' });
            });
          }
          lines.push({ text: '', style: 'spacing' });
          break;
        case 'sceneCharacters':
          lines.push({ text: item.content, style: 'sceneCharacters' });
          lines.push({ text: '', style: 'spacing' });
          break;
        default:
          if (item.content) {
            lines.push({ text: item.content, style: 'normal' });
          }
      }
    });

    return lines;
  }, []);

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
        format: 'a4'
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
      const shortTitle = mainTitle.length > 50 ? mainTitle.substring(0, 47) + '...' : mainTitle;
      pdf.text(shortTitle, marginLeft, 30);
      
      // Date de génération
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      const today = new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
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

      // Styles pour différents types de contenu
      const styles = {
        author: { fontSize: 14, fontStyle: 'bold', spacing: 6 },
        title: { fontSize: 16, fontStyle: 'bold', spacing: 7 },
        subtitle: { fontSize: 13, fontStyle: 'italic', spacing: 5 },
        date: { fontSize: 11, fontStyle: 'normal', spacing: 4 },
        heading: { fontSize: 14, fontStyle: 'bold', spacing: 6 },
        sceneHeading: { fontSize: 13, fontStyle: 'bold', spacing: 6 },
        speaker: { fontSize: 12, fontStyle: 'bold', spacing: 4 },
        dialogue: { fontSize: 11, fontStyle: 'normal', spacing: 4 },
        stage: { fontSize: 10, fontStyle: 'italic', spacing: 4 },
        cast: { fontSize: 11, fontStyle: 'normal', spacing: 4 },
        sceneCharacters: { fontSize: 11, fontStyle: 'italic', spacing: 4 },
        normal: { fontSize: 11, fontStyle: 'normal', spacing: 4 },
        spacing: { fontSize: 11, fontStyle: 'normal', spacing: 3 }
      };

      // Traiter TOUTES les pages de transcription
      const pagesToProcess = transcriptionPages;

      // Parcourir toutes les pages de transcription
      pagesToProcess.forEach((page, pageIndex) => {
        if (pageIndex > 0) {
          pdf.addPage();
          currentY = marginTop;
        }

        // Ajouter le numéro de page de la transcription avec style
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(30, 58, 138); // Bleu du projet
        pdf.text(`Page ${page.pageNumber}`, marginLeft, currentY);
        pdf.setTextColor(0, 0, 0); // Remettre en noir
        currentY += 12;

        // Formater et ajouter le contenu
        const formattedContent = formatContentForPDF(page.content);

        formattedContent.forEach(line => {
          const style = styles[line.style] || styles.normal;
          
          // Vérifier si on a besoin d'une nouvelle page
          if (currentY + style.spacing > pageHeight - marginBottom) {
            pdf.addPage();
            currentY = marginTop;
          }

          // Appliquer le style
          pdf.setFontSize(style.fontSize);
          pdf.setFont(undefined, style.fontStyle);

          // Diviser le texte si nécessaire
          const textLines = pdf.splitTextToSize(line.text, contentWidth);
          
          // Ajouter le texte
          if (line.text) {
            pdf.text(textLines, marginLeft, currentY);
            currentY += textLines.length * style.spacing;
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
          pageHeight - 10
        );
      }

      // Télécharger le PDF
      const fileName = `${anthologyTitle || title}_transcription.pdf`.replace(/[^a-z0-9_\-\.]/gi, '_');
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
            width="18" 
            height="18" 
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
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download as PDF</span>
        </>
      )}
    </button>
  );
};

TranscriptionPDFDownload.propTypes = {
  transcriptionPages: PropTypes.arrayOf(
    PropTypes.shape({
      pageNumber: PropTypes.number,
      content: PropTypes.array
    })
  ),
  title: PropTypes.string,
  anthologyTitle: PropTypes.string
};

export default TranscriptionPDFDownload;
