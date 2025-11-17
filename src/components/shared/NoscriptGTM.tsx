interface NoscriptGTMProps {
  gtmId: string;
}

const NoscriptGTM: React.FC<NoscriptGTMProps> = ({ gtmId }) => {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
};

export default NoscriptGTM;
