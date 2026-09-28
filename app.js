/**
 * AURABIDS - Interactive Auction Controller
 * Handles Live Bids, Countdowns, and UI Updates
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentBid: 18500,
    userBalance: 12450.00,
    bidIncrement: 500
  };

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const elements = {
    featuredBidDisplay: document.getElementById('featured-bid'),
    btnPlaceMainBid: document.getElementById('btn-place-main-bid'),
    quickBidBtns: document.querySelectorAll('.btn-quick-bid'),
    bidsStream: document.getElementById('bids-stream'),
    toastContainer: document.getElementById('toast-container'),
    userBalanceDisplay: document.querySelector('.user-balance')
  };

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  window.showToast = (message, type = 'info') => {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // =========================================================================
  // BIDDING LOGIC
  // =========================================================================
  
  // Format currency
  const formatMoney = (amount) => {
    return '$' + amount.toLocaleString('en-US');
  };

  // Handle Quick Bids
  elements.quickBidBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bidAmount = parseInt(e.target.dataset.amount);
      placeBid(bidAmount);
    });
  });

  // Handle Main Bid Button
  if (elements.btnPlaceMainBid) {
    elements.btnPlaceMainBid.addEventListener('click', () => {
      const nextBid = state.currentBid + state.bidIncrement;
      placeBid(nextBid);
    });
  }

  function placeBid(amount) {
    if (amount <= state.currentBid) {
      window.showToast('Bid must be higher than current bid!', 'error');
      return;
    }

    // Update State
    state.currentBid = amount;
    
    // Update UI
    if (elements.featuredBidDisplay) {
      elements.featuredBidDisplay.textContent = formatMoney(state.currentBid);
      
      // Add animation effect
      elements.featuredBidDisplay.style.transform = 'scale(1.1)';
      setTimeout(() => {
        elements.featuredBidDisplay.style.transform = 'scale(1)';
      }, 200);
    }

    // Update Quick Bid Buttons text and values based on new bid
    elements.quickBidBtns[0].dataset.amount = state.currentBid + 500;
    elements.quickBidBtns[0].textContent = `+$500`;
    
    elements.quickBidBtns[1].dataset.amount = state.currentBid + 1000;
    elements.quickBidBtns[1].textContent = `+$1000`;
    
    elements.quickBidBtns[2].dataset.amount = state.currentBid + 2000;
    elements.quickBidBtns[2].textContent = `+$2000`;

    window.showToast(`Successfully placed bid for ${formatMoney(amount)}`, 'success');
    
    // Add to live feed
    addLiveFeedItem('You', 'Rolex Submariner', amount, true);
  }

  // =========================================================================
  // LIVE FEED SIMULATOR
  // =========================================================================
  const mockNames = ['David W.', 'Sarah M.', 'James L.', 'Emma C.', 'Robert K.'];
  const mockItems = ['Rolex Submariner', 'Leica M6', 'Porsche 911', 'Oil Canvas'];

  function addLiveFeedItem(user, item, amount, isCurrentUser = false) {
    if (!elements.bidsStream) return;

    const initial = isCurrentUser ? 'ME' : user.charAt(0) + user.split(' ')[1]?.charAt(0) || 'U';
    
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item new';
    
    feedItem.innerHTML = `
      <div class="feed-avatar" style="background-color: ${isCurrentUser ? '#d4af37' : '#000'}">${initial}</div>
      <div class="feed-info">
        <p class="feed-text"><strong>${isCurrentUser ? 'You' : user}</strong> bid on <span>${item}</span></p>
        <span class="feed-time">Just now</span>
      </div>
      <div class="feed-amount">${formatMoney(amount)}</div>
    `;

    // Insert at top
    elements.bidsStream.insertBefore(feedItem, elements.bidsStream.firstChild);

    // Remove 'new' class after animation
    setTimeout(() => {
      feedItem.classList.remove('new');
    }, 2000);

    // Keep only last 10 items
    if (elements.bidsStream.children.length > 10) {
      elements.bidsStream.removeChild(elements.bidsStream.lastChild);
    }
  }

  // Simulate random bids every 8-15 seconds
  setInterval(() => {
    const randomUser = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
    
    let randomAmount;
    if (randomItem === 'Rolex Submariner') {
      state.currentBid += (Math.floor(Math.random() * 3) + 1) * 500;
      randomAmount = state.currentBid;
      
      if (elements.featuredBidDisplay) {
        elements.featuredBidDisplay.textContent = formatMoney(state.currentBid);
      }
    } else {
      randomAmount = Math.floor(Math.random() * 10000) + 1000;
    }

    addLiveFeedItem(randomUser, randomItem, randomAmount);
  }, Math.random() * 7000 + 8000);

  // =========================================================================
  // COUNTDOWN TIMERS
  // =========================================================================
  
  // Featured Timer (Hours, Mins, Secs)
  let featuredSeconds = (2 * 3600) + (45 * 60) + 12; 
  
  setInterval(() => {
    if (featuredSeconds <= 0) return;
    featuredSeconds--;
    
    const h = Math.floor(featuredSeconds / 3600);
    const m = Math.floor((featuredSeconds % 3600) / 60);
    const s = featuredSeconds % 60;
    
    const hEl = document.querySelector('.timer-featured .hours');
    const mEl = document.querySelector('.timer-featured .minutes');
    const sEl = document.querySelector('.timer-featured .seconds');
    
    if (hEl) hEl.textContent = h.toString().padStart(2, '0');
    if (mEl) mEl.textContent = m.toString().padStart(2, '0');
    if (sEl) sEl.textContent = s.toString().padStart(2, '0');
    
  }, 1000);

});