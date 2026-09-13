export const metadata = {
  title: 'Carlinho Mathématiques',
  description: 'Plataforma matemática avançada e renderização hiperespacial',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        
        <div vw="true" className="enabled" style={{ position: 'fixed', right: '10px', top: '50%', zIndex: 9999 }}>
          <div vw-access-button="true" className="active"></div>
          <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
        
        <script src="https://vlibras.gov.br/app/vlibras-plugin.js" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function() {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
              };
            `,
          }}
        />
      </body>
    </html>
  )
}
