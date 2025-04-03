export const getCoverDefinition = ({ t, ...props }) => [
  { text: t('home:fullTitle') },
  { text: t('common:work') },
  { text: props.title },
  { text: 'puppetplays.eu' },
  {
    columns: [
      {
        image: 'logo-ue.png',
        height: 60,
        width: 80,
      },
      {
        image: 'logo-erc.png',
        height: 60,
      },
    ],
  },
  { text: 'ERC - GA 835193' },
];

export const contentDefinition = [
  { props: ['title'], style: 'header' },
  { props: ['subtitle'], style: 'subHeader' },
  {
    props: ['authors', 'mostRelevantDate', 'compositionPlace', 'mainLanguage'],
    style: 'default',
  },
  {
    props: ['authors', 'mostRelevantDate', 'compositionPlace', 'mainLanguage'],
    style: 'default',
  },
  { props: ['genre'], withLabel: true },
  { props: ['characters'], withLabel: true },
  { props: ['actsCount'], withLabel: true },
  { props: ['note'], withLabel: true },
  { props: ['abstract'], withLabel: true },
  { props: ['hypotexts'], withLabel: true },
  { props: ['compositionDisplayDate'], withLabel: true },
];

export const getPdfDefinition = props => ({
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 60],
  styles: {
    header: {
      fontSize: 22,
      bold: true,
    },
    paragraph: {
      fontSize: 12,
    },
  },
  defaultStyle: {
    fontSize: 12,
  },
  header: 'Puppetplays',
  content: [
    { text: props.title, style: 'header' },
    { text: props.subtitle, style: 'header' },
    { text: props.authors, style: 'header' },
  ],
  footer: {
    columns: ['Left part', { text: 'Right part', alignment: 'right' }],
  },
  info: {
    title: props.title,
    author: 'Puppetplays',
    keywords: props.keywords.map(k => k.title).join(', '),
  },
});
