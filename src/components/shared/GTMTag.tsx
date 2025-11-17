import { useEffect } from 'react';

interface GTMTagProps {
  gtmId: string;
}

const GTMTag: React.FC<GTMTagProps> = ({ gtmId }) => {
  useEffect(() => {
    // Verificar si GTM ya está cargado para evitar duplicados
    if (document.getElementById('gtm-script')) {
      return;
    }

    // Inyectar dataLayer y script de GTM en el <head>
    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.innerHTML = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;

    // Agregar al head
    document.head.appendChild(script);

    // Cleanup: remover script al desmontar
    return () => {
      const existingScript = document.getElementById('gtm-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [gtmId]);

  // No renderiza nada en el DOM visible
  return null;
};

export default GTMTag;
