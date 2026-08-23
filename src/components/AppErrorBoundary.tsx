import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[CCT] Error de render capturado por AppErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="cct-runtime-error" role="alert">
          <div>
            <strong>CCT · FIEE UNI</strong>
            <h1>No se pudo mostrar la página.</h1>
            <p>Recarga el sitio para volver a intentarlo.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Recargar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
