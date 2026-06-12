const API_BASE_URL = "http://localhost:3000";

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };
  const usuarioStr = localStorage.getItem("usuario");
  if (usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr);
      if (usuario && usuario.token) {
        headers["Authorization"] = `Bearer ${usuario.token}`;
      }
    } catch (e) {
      console.error("Erro ao ler token", e);
    }
  }
  return headers;
}

/**
 * Utilitário central para chamadas de API, facilitando tratamento de erros globais
 * e mantendo a estabilidade do Frontend.
 */
export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro no GET ${endpoint}:`, error);
      throw error;
    }
  },

  async post(endpoint, body) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || errorData.error || `Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro no POST ${endpoint}:`, error);
      throw error;
    }
  },

  async put(endpoint, body) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || errorData.error || `Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro no PUT ${endpoint}:`, error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro no DELETE ${endpoint}:`, error);
      throw error;
    }
  }
};
