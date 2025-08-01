console.log('🎭 Fashion Show page DOM loaded');

// 🔹 Get catId from URL
const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get('catId');
console.log('🐾 Cat ID from URL:', catId);

// 🔹 Get JWT from localStorage
const token = localStorage.getItem('token');

if (!token) {
  console.warn('🔒 No token found. Redirecting to login...');
  // window.location.href = '/login.html';
} else if (!catId) {
  console.error('❌ No catId provided in URL');
} else {
  connectToFashionShow({ token, catId });
}

async function connectToFashionShow({ token, catId }) {
  try {
    // 🔐 Fetch user cats from server to get playerId
    const res = await fetch('https://catwalk.onrender.com/api/cats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const cats = await res.json();
    const cat = cats.find(c => String(c.cat_id) === catId);
    const playerId = cat?.player_id;

    if (!playerId) {
      console.error(`❌ Cat with ID ${catId} not found for this user`);
      return;
    }

    console.log('🎭 Using authenticated player ID:', playerId);

    // 🔌 Join via Socket.IO
    const socket = io('https://catwalk.onrender.com');

    socket.on('connect', () => {
      console.log('🔌 Connected to socket:', socket.id);
      socket.emit('join', { playerId, catId });
    });

    socket.on('participant_update', (msg) => {
      console.log('👥 Participant update:', msg);
    });

    socket.on('voting_phase', (msg) => {
      console.log('🗳️ Voting phase started:', msg);
    });

    socket.on('voting_update', (msg) => {
      console.log('🔄 Voting update:', msg);
    });

    socket.on('results', (msg) => {
      console.log('🏆 Final results:', msg);
    });

  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
}
