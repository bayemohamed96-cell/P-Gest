/**
 * Script de test manuel du flux auth côté frontend (Node, hors React UI)
 * 1. Login
 * 2. Appel summary (access token)
 * 3. Refresh token
 * 4. Nouvel appel summary avec nouveau access token
 */
import axios from 'axios';

async function detectApiBase(): Promise<string> {
  // Si l'utilisateur fournit explicitement une base via VITE_API_BASE on la respecte.
  if (process.env.VITE_API_BASE) {
    return process.env.VITE_API_BASE.replace(/\/$/, '');
  }
  const explicitPort = process.env.VITE_BACKEND_PORT && !isNaN(Number(process.env.VITE_BACKEND_PORT))
    ? [Number(process.env.VITE_BACKEND_PORT)]
    : [];
  const candidatePorts = [...explicitPort, 3000, 3001, 3002, 3003, 3004, 3005].filter((v, i, a) => a.indexOf(v) === i);
  for (const port of candidatePorts) {
    try {
      const url = `http://localhost:${port}/api/status/health`;
      const res = await axios.get(url, { timeout: 600 });
      if (res.status < 500) {
        console.log(`→ Backend détecté sur le port ${port}`);
        return `http://localhost:${port}/api`;
      }
    } catch (e) {
      // silencieux, on tente le suivant
    }
  }
  console.warn('⚠️ Aucun backend détecté sur la plage 3000-3005 (ou VITE_BACKEND_PORT). On utilise http://localhost:3000/api quand même.');
  return 'http://localhost:3000/api';
}

async function main() {
  console.log('\n=== TEST FLUX AUTH FRONTEND ===');
  const API_URL = (await detectApiBase()).replace(/\/$/, '');
  console.log('API_URL =', API_URL);
  const email = process.env.TEST_EMAIL || 'admin@example.com';
  const password = process.env.TEST_PASSWORD || 'password';

  try {
    console.log('1) Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { access_token: access1, refresh_token: refresh1 } = loginRes.data;
    console.log('   Access (len):', access1?.length, 'Refresh (len):', refresh1?.length);

    console.log('2) Summary avec access1');
    const summary1 = await axios.get(`${API_URL}/status/summary`, { headers: { Authorization: `Bearer ${access1}` } });
    console.log('   OK summary.lots:', summary1.data?.lots);

    console.log('3) Refresh...');
    const refreshRes = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh1 });
    const { access_token: access2, refresh_token: refresh2 } = refreshRes.data;
    console.log('   Nouveau access (len):', access2?.length, 'Nouveau refresh (len):', refresh2?.length);

    if (access1 === access2) console.warn('⚠️ Access token identique (attendu parfois si mêmes claims et délai court)');

    console.log('4) Summary avec access2');
    const summary2 = await axios.get(`${API_URL}/status/summary`, { headers: { Authorization: `Bearer ${access2}` } });
    console.log('   OK summary2.monthRevenueCfa:', summary2.data?.monthRevenueCfa);

    console.log('\n✅ Flux auth terminé avec succès');
    process.exit(0);
  } catch (err: any) {
    if (err?.response) {
      console.error('Erreur HTTP', err.response.status, err.response.data);
    } else if (err?.request) {
      console.error('Erreur réseau (pas de réponse)');
    } else {
      console.error('Erreur', err?.message || err);
    }
    if (err?.config) {
      console.error('Endpoint tenté:', err.config.method, err.config.url);
    }
    process.exit(1);
  }
}

main();
