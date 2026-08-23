type TrustedStaticShellProps = {
  html: string;
};

/**
 * Único límite permitido entre React y el markup estático aprobado del CCT.
 *
 * El contenido recibido aquí proviene exclusivamente de archivos versionados
 * dentro de `src/pages/<pagina>/markup.html` y `src/layout/*.html`; nunca debe
 * recibir contenido de usuarios, parámetros de URL, APIs ni almacenamiento local.
 * Mantener este límite en un solo componente permite migrar páginas a JSX de
 * forma gradual sin repartir el mecanismo de HTML estático por la aplicación.
 */
export function TrustedStaticShell({ html }: TrustedStaticShellProps) {
  return <div className="cct-react-shell" dangerouslySetInnerHTML={{ __html: html }} />;
}
