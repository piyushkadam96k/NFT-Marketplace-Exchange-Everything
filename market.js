// Market Logic Simulation using localStorage

const Market = {
    // Initial State
    initialState: {
        balance: 10.00, // Starting balance in ETH
        inventory: [],
        activity: [
            { type: 'Sale', item: 'CryptoPunk #7804', price: '24.5 ETH', from: '0x742...C663', to: '0x8ba...136c', time: '2 mins ago' },
            { type: 'List', item: 'Azuki #4521', price: '8.2 ETH', from: '0x9c2...3B2A', to: '-', time: '5 mins ago' },
            { type: 'Offer', item: 'Pudgy Penguin #123', price: '32.0 ETH', from: '0x1a2...9f88', to: '-', time: '12 mins ago' }
        ],
        listings: [
            { id: 'nft-1', name: 'CryptoPunk #7804', collection: 'CryptoPunks', price: 24.5, image: './resources/nft-1.jpg' },
            { id: 'nft-2', name: 'Azuki #4521', collection: 'Azuki', price: 8.2, image: './resources/nft-2.jpg' },
            { id: 'nft-3', name: 'Bored Ape #3321', collection: 'BAYC', price: 19.5, image: './resources/nft-8.jpg' },
            { id: 'nft-4', name: 'Pudgy Penguin #123', collection: 'Pudgy Penguins', price: 34.6, image: './resources/nft-5.jpg' },
            { id: 'nft-5', name: 'Clone X #1102', collection: 'Clone X', price: 12.5, image: './resources/nft-6.jpg' },
            { id: 'nft-6', name: 'Doodle #2245', collection: 'Doodles', price: 5.8, image: './resources/nft-4.jpg' },
            { id: 'nft-7', name: 'Moonbird #8821', collection: 'Moonbirds', price: 4.2, image: './resources/nft-15.jpg' },
            { id: 'nft-8', name: 'Mutant Ape #9921', collection: 'MAYC', price: 7.5, image: './resources/nft-10.jpg' },
            { id: 'nft-9', name: 'NodeMonke #55', collection: 'NodeMonkes', price: 0.28, currency: 'BTC', image: './resources/nft-12.jpg' }
        ]
    },

    // Initialize Market
    init() {
        if (!localStorage.getItem('nftMarketState')) {
            this.saveState(this.initialState);
        }
        this.updateUI();
    },

    // Set a max balance for demo/testing
    setMaxBalance(amount = 999999.99) {
        try {
            const state = this.getState();
            state.balance = parseFloat(amount);
            this.saveState(state);
            return { success: true, balance: state.balance };
        } catch (e) {
            console.warn('setMaxBalance failed', e);
            return { success: false, message: e.message };
        }
    },



    // Simulate quick sell (instant sell to market for sellPrice)
    async simulateQuickSellByMockId(mockId) {
        if (typeof mockNftData === 'undefined') return { success: false, message: 'NFT data missing' };
        const nft = mockNftData.find(n => n.id === mockId);
        if (!nft) return { success: false, message: 'NFT not found' };
        const state = this.getState();
        const sellPrice = parseFloat(nft.price);

        // Only allow if owner exists (seller is current owner)
        // For demo, allow quick sell regardless
        state.balance = parseFloat((state.balance + sellPrice).toFixed(4));

        // Change ownership to null (market) and mark as buy-now
        nft.owner = null;
        nft.status = 'buy-now';

        // Add to listings
        state.listings.push({ id: `nft-${nft.id}`, name: nft.name, collection: nft.collection, price: sellPrice, image: nft.image });

        state.activity.unshift({ type: 'Sale', item: nft.name, price: `${sellPrice} ${nft.currency || 'ETH'}`, from: 'You', to: 'Market', time: 'Just now' });

        this.saveState(state);
        try { localStorage.setItem('nftData', JSON.stringify(mockNftData)); } catch (e) { }
        return { success: true };
    },

    // Simulate listing an NFT (confirm sell) by updating its price and status
    async simulateListByMockId(mockId, price) {
        if (typeof mockNftData === 'undefined') return { success: false, message: 'NFT data missing' };
        const nft = mockNftData.find(n => n.id === mockId);
        if (!nft) return { success: false, message: 'NFT not found' };

        nft.price = parseFloat(price).toFixed(4);
        nft.status = 'buy-now';

        try { localStorage.setItem('nftData', JSON.stringify(mockNftData)); } catch (e) { }
        return { success: true };
    },

    // Get State
    getState() {
        return JSON.parse(localStorage.getItem('nftMarketState')) || this.initialState;
    },

    // Save State
    saveState(state) {
        localStorage.setItem('nftMarketState', JSON.stringify(state));
        this.updateUI();
    },

    _generateTxHash() {
        return '0x' + Math.random().toString(16).substr(2, 64);
    },

    // Buy NFT
    buyNFT(nftId) {
        const state = this.getState();
        const listingIndex = state.listings.findIndex(item => item.id === nftId);

        if (listingIndex === -1) {
            alert('Item not found or already sold!');
            return;
        }

        const item = state.listings[listingIndex];

        if (state.balance < item.price) {
            alert('Insufficient funds!');
            return;
        }

        // Execute Transaction
        state.balance -= item.price;
        state.inventory.push(item);
        state.listings.splice(listingIndex, 1);

        // Add Activity
        state.activity.unshift({
            type: 'Sale',
            item: item.name,
            price: `${item.price} ${item.currency || 'ETH'}`,
            from: 'Market',
            to: 'You',
            time: 'Just now'
        });

        this.saveState(state);
        try {
            window.dispatchEvent(new CustomEvent('nftPurchased', { detail: { nftId } }));
        } catch (e) { }
        alert(`Successfully purchased ${item.name}!`);
        window.location.reload(); // Refresh to update UI
    },

    // Simulate purchase by using mockNftData id (numeric) and update both Market state and mockNftData
    async simulatePurchaseByMockId(mockId, buyerAddress = 'You') {
        // Ensure mockNftData is loaded globally
        if (typeof mockNftData === 'undefined') {
            console.error('mockNftData not found in simulatePurchaseByMockId');
            return { success: false, message: 'NFT data not found' };
        }

        const nft = mockNftData.find(n => n.id === mockId);
        if (!nft) {
            return { success: false, message: 'NFT not found' };
        }

        const state = this.getState();
        const price = parseFloat(nft.price);
        const serviceFee = price * 0.025;
        const total = price + serviceFee;

        if (state.balance < total) {
            return { success: false, message: 'Insufficient funds' };
        }

        // Deduct from Market balance and add to inventory
        state.balance = parseFloat((state.balance - total).toFixed(4));
        state.inventory.push({ ...nft, purchasedBy: buyerAddress });

        // Add Activity
        state.activity.unshift({
            type: 'Sale',
            item: nft.name,
            price: `${price} ${nft.currency || 'ETH'}`,
            from: nft.owner || 'Seller',
            to: buyerAddress,
            time: 'Just now'
        });

        // Mark nft as owned in mockNftData
        nft.owner = buyerAddress === 'You' ? (typeof currentAccount !== 'undefined' ? currentAccount : buyerAddress) : buyerAddress;
        nft.status = 'owned';

        // Persist both states
        this.saveState(state);
        try {
            localStorage.setItem('nftData', JSON.stringify(mockNftData));
        } catch (e) {
            console.warn('Failed to persist mockNftData', e);
        }

        // Return a simulated transaction hash
        const txHash = this._generateTxHash();
        // Dispatch an event so other parts of the UI can react
        try {
            window.dispatchEvent(new CustomEvent('nftPurchased', { detail: { nftId: mockId, txHash } }));
        } catch (e) {
            console.warn('Failed to dispatch nftPurchased event', e);
        }

        return { success: true, txHash };
    },

    // Sell NFT
    sellNFT(nftId, price) {
        const state = this.getState();
        const inventoryIndex = state.inventory.findIndex(item => item.id === nftId);

        if (inventoryIndex === -1) {
            alert('Item not found in inventory!');
            return;
        }

        const item = state.inventory[inventoryIndex];
        item.price = parseFloat(price);

        // Execute Transaction
        state.balance += item.price; // Simplified: Instant sell to "Market"
        state.listings.push(item);
        state.inventory.splice(inventoryIndex, 1);

        // Add Activity
        state.activity.unshift({
            type: 'List',
            item: item.name,
            price: `${item.price} ${item.currency || 'ETH'}`,
            from: 'You',
            to: 'Market',
            time: 'Just now'
        });

        this.saveState(state);
        alert(`Successfully listed ${item.name} for ${item.price} ETH!`);
        window.location.reload();
    },

    // Update UI Elements
    updateUI() {
        const state = this.getState();

        // Update Balance
        const balanceEl = document.getElementById('walletBalance');
        if (balanceEl) {
            balanceEl.textContent = `${state.balance.toFixed(2)} ETH`;
        }

        // Update Buttons (Check ownership)
        state.inventory.forEach(item => {
            const btn = document.querySelector(`button[onclick="Market.buyNFT('${item.id}')"]`);
            if (btn) {
                btn.textContent = 'Owned';
                btn.disabled = true;
                btn.classList.add('bg-gray-600', 'cursor-not-allowed');
                btn.classList.remove('btn-primary');
            }
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Market.init();
});
