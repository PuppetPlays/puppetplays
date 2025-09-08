import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import styles from './TranscriptionPDFDownload.module.scss';

/**
 * Composant pour télécharger une transcription en PDF
 * Utilise jsPDF pour générer le PDF côté client
 */
const TranscriptionPDFDownload = ({ 
  transcriptionPages = [], 
  title = 'Transcription',
  anthologyTitle = '',
  currentPage = null 
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
      const marginLeft = 20;
      const marginRight = 20;
      const marginTop = 25;
      const marginBottom = 20;
      const contentWidth = pageWidth - marginLeft - marginRight;
      let currentY = marginTop;

      // Ajouter le titre principal
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      const mainTitle = anthologyTitle || title;
      const titleLines = pdf.splitTextToSize(mainTitle, contentWidth);
      pdf.text(titleLines, marginLeft, currentY);
      currentY += titleLines.length * 8 + 5;

      // Ajouter une ligne de séparation
      pdf.setLineWidth(0.5);
      pdf.line(marginLeft, currentY, pageWidth - marginRight, currentY);
      currentY += 10;

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

      // Traiter toutes les pages ou seulement la page courante
      const pagesToProcess = currentPage 
        ? transcriptionPages.filter(p => p.pageNumber === currentPage)
        : transcriptionPages;

      // Parcourir toutes les pages de transcription
      pagesToProcess.forEach((page, pageIndex) => {
        if (pageIndex > 0) {
          pdf.addPage();
          currentY = marginTop;
        }

        // Ajouter le numéro de page de la transcription
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Page ${page.pageNumber}`, marginLeft, currentY);
        currentY += 8;

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

      // Ajouter les numéros de page en bas
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.text(
          `${i} / ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
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
  }, [transcriptionPages, title, anthologyTitle, currentPage, formatContentForPDF, t]);

  // Si pas de transcription, ne pas afficher le bouton
  if (!transcriptionPages || transcriptionPages.length === 0) {
    return null;
  }

  return (
    <button
      className={`${styles.downloadButton} ${isGenerating ? styles.generating : ''}`}
      onClick={generatePDF}
      disabled={isGenerating}
      title={currentPage 
        ? t('anthology:downloadCurrentPagePDF') 
        : t('anthology:downloadFullPDF')}
    >
      {isGenerating ? (
        <>
          <span className={styles.loadingIcon}>⏳</span>
          {t('anthology:generatingPDF')}
        </>
      ) : (
        <>
          <svg 
            className={styles.downloadIcon}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {currentPage 
            ? t('anthology:downloadPagePDF')
            : t('anthology:downloadPDF')}
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
  anthologyTitle: PropTypes.string,
  currentPage: PropTypes.number
};

export default TranscriptionPDFDownload;
