// Shared Wallet Logic
let currentAccount = null;

// Check if MetaMask is already connected
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                updateWalletUI();
                // Dispatch event for other scripts to know wallet is connected
                window.dispatchEvent(new CustomEvent('walletConnected', { detail: { account: currentAccount } }));
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    }
}

// Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to continue.');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        updateWalletUI();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('walletConnected', { detail: { account: currentAccount } }));

        console.log('Wallet connected:', currentAccount);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

function disconnectWallet() {
    currentAccount = null;
    updateWalletUI();
    window.dispatchEvent(new Event('walletDisconnected'));
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        currentAccount = accounts[0];
        updateWalletUI();
        window.dispatchEvent(new CustomEvent('walletConnected', { detail: { account: currentAccount } }));
    }
}

function handleChainChanged(chainId) {
    console.log('Chain changed:', chainId);
    window.location.reload();
}

function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const walletBalance = document.getElementById('walletBalance');

    if (connectBtn && walletInfo) {
        if (currentAccount) {
            connectBtn.classList.add('hidden');
            walletInfo.classList.remove('hidden');

            // Get balance from Market logic
            let balance = '0.00';
            if (typeof Market !== 'undefined') {
                balance = Market.getState().balance.toFixed(2);
            } else {
                // Fallback if Market is not loaded yet
                const state = JSON.parse(localStorage.getItem('nftMarketState'));
                if (state) {
                    balance = state.balance.toFixed(2);
                }
            }

            if (walletBalance) {
                walletBalance.textContent = `${balance} ETH`;
            }

            if (walletAddress) {
                walletAddress.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
            }
        } else {
            connectBtn.classList.remove('hidden');
            walletInfo.classList.add('hidden');
        }
    }
}

// Export balance functions
window.getFakeBalance = function () {
    if (typeof Market !== 'undefined') {
        try {
            return Market.getState().balance;
        } catch (e) {
            console.warn('Failed to read Market state in getFakeBalance', e);
        }
    }
    // Fallback to stored fakeBalance if Market not available
    const stored = localStorage.getItem('fakeBalance');
    return stored ? parseFloat(stored) : 0;
};

// Update balance using Market state to keep everything in sync
window.updateFakeBalance = function (amount) {
    if (typeof Market !== 'undefined') {
        try {
            const state = Market.getState();
            state.balance = parseFloat((state.balance + amount).toFixed(4));
            Market.saveState(state);
            return state.balance;
        } catch (e) {
            console.warn('Failed to update Market state in updateFakeBalance', e);
        }
    }
    const currentBalance = window.getFakeBalance();
    const newBalance = currentBalance + amount;
    localStorage.setItem('fakeBalance', newBalance.toFixed(2));
    updateWalletUI();
    return newBalance;
};

// Initialize wallet listeners
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Wallet script initialized');
    checkWalletConnection();

    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        console.log('Connect wallet button found, attaching listener');
        connectBtn.addEventListener('click', connectWallet);
    } else {
        console.error('Connect wallet button NOT found');
    }
    const connectBtnMobile = document.getElementById('connectWalletMobile');
    if (connectBtnMobile) {
        connectBtnMobile.addEventListener('click', connectWallet);
    }
    // Developer 'top up' floating button to quickly set demo balance to a very high value
    const devTopupBtnFloating = document.getElementById('devTopupBtnFloating');
    function topUpToFull() {
        if (typeof Market !== 'undefined' && Market.setMaxBalance) {
            Market.setMaxBalance(999999.99);
            updateWalletUI();
            alert('Your demo balance has been topped up to 999,999.99 ETH');
        } else {
            const state = JSON.parse(localStorage.getItem('nftMarketState')) || {};
            state.balance = 999999.99;
            localStorage.setItem('nftMarketState', JSON.stringify(state));
            updateWalletUI();
            alert('Your demo balance has been topped up (fallback).');
        }
    }
    if (devTopupBtnFloating) {
        devTopupBtnFloating.addEventListener('click', topUpToFull);
    }
    // Setup navigation active state and mobile menu toggle
    setActiveNavLink();
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }


});

function setActiveNavLink() {
    try {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        // Find top-level nav links
        const links = document.querySelectorAll('nav a');
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            const hrefName = href.split('/').pop();
            if (hrefName === path) {
                a.classList.add('text-white', 'font-medium');
                a.classList.remove('text-gray-300');
            } else {
                a.classList.remove('text-white', 'font-medium');
                a.classList.add('text-gray-300');
            }
        });
        // Fallback: if nothing matched (e.g. NFT detail pages), highlight Discover (index.html)
        const activeLinks = Array.from(links).filter(a => a.classList.contains('text-white') && a.classList.contains('font-medium'));
        if (activeLinks.length === 0) {
            const discoverLink = document.querySelector('nav a[href="index.html"]');
            if (discoverLink) {
                discoverLink.classList.add('text-white', 'font-medium');
                discoverLink.classList.remove('text-gray-300');
            }
        }
    } catch (e) {
        console.warn('Failed to set active nav link', e);
    }
}
