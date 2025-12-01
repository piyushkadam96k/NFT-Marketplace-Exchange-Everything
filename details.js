

document.addEventListener('DOMContentLoaded', function () {
    initializeDetailsPage();
});

function initializeDetailsPage() {
    // Get NFT ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = parseInt(urlParams.get('id'));

    // Load from localStorage if available
    const savedData = localStorage.getItem('nftData');
    if (savedData) {
        mockNftData = JSON.parse(savedData);
    }

    if (!nftId) {
        // If no ID, redirect to index or show error
        // For demo, we'll just load the first one or handle gracefully
        console.log('No NFT ID provided');
        return;
    }

    const nft = mockNftData.find(n => n.id === nftId);

    if (!nft) {
        document.body.innerHTML = '<div class="text-white text-center pt-20">NFT not found</div>';
        return;
    }

    // Update Page Title
    document.title = `${nft.name} - NFT Details`;

    // Populate Data
    populateNftData(nft);

    // Initialize Chart
    initializePriceChart();

    // Event Listeners
    setupEventListeners(nft);
}

function populateNftData(nft) {
    // Image
    const imageContainer = document.querySelector('.nft-image-container img');
    if (imageContainer) {
        imageContainer.src = nft.image;
        imageContainer.alt = nft.name;
    }

    // Name and Owner
    const nameEl = document.querySelector('h1');
    if (nameEl) nameEl.textContent = nft.name;

    const ownerEl = document.querySelector('.info-card p a');
    if (ownerEl) {
        ownerEl.textContent = `${nft.owner.substring(0, 6)}...${nft.owner.substring(38)}`;
        ownerEl.href = `profile.html?address=${nft.owner}`;
    }

    // Likes
    const likesBtn = document.querySelector('.btn-secondary'); // Assuming first one is likes
    if (likesBtn) likesBtn.innerHTML = `❤️ ${nft.likes}`;

    // Price
    const priceEl = document.querySelector('.text-3xl.font-bold.mono');
    if (priceEl) priceEl.textContent = `${nft.price} ${nft.currency}`;

    // USD Price (Mock calculation)
    const usdPriceEl = document.querySelector('.text-gray-400.mono');
    if (usdPriceEl) {
        const ethPrice = 3000; // Mock ETH price
        const usdValue = (parseFloat(nft.price) * ethPrice).toLocaleString();
        usdPriceEl.textContent = `$${usdValue} USD`;
    }

    // Collection
    const collectionNameEl = document.querySelector('.collection-name'); // Need to add class in HTML
    // Or find by text content if class not present, but better to update HTML.
    // For now, let's try to find the collection section
    const collectionHeader = Array.from(document.querySelectorAll('h4')).find(el => el.textContent === 'CryptoPunks');
    if (collectionHeader) {
        collectionHeader.textContent = nft.collection;
        // Update collection image if we had one
        const collectionImg = collectionHeader.parentElement.previousElementSibling;
        if (collectionImg && collectionImg.tagName === 'IMG') {
            collectionImg.src = nft.image; // Using NFT image as collection image for now
        }
    }

    // Description
    const descriptionEl = document.getElementById('nftDescription');
    if (descriptionEl) {
        descriptionEl.textContent = nft.description || "No description available.";
    }

    // Attributes
    const attributesContainer = document.querySelector('.grid.grid-cols-3.gap-3');
    if (attributesContainer) {
        attributesContainer.innerHTML = nft.attributes.map(attr => `
            <div class="attribute-tag rounded-lg p-3 text-center">
                <div class="text-sm text-gray-400">Attribute</div>
                <div class="font-semibold">${attr}</div>
            </div>
        `).join('');
    }
}

function setupEventListeners(nft) {
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.onclick = () => openPurchaseModal(nft);
    }

    // Wallet connection listener
    window.addEventListener('walletConnected', () => {
        const makeOfferBtn = document.getElementById('makeOfferBtn');
        const actionContainer = document.querySelector('.flex.space-x-4.mb-4'); // Container for buttons

        // Update UI if needed based on ownership
        if (currentAccount && nft.owner === currentAccount) {
            if (buyNowBtn) {
                buyNowBtn.textContent = 'Sell NFT';
                buyNowBtn.onclick = () => showSellNftModal(nft.id);
                buyNowBtn.classList.remove('btn-primary');
                buyNowBtn.classList.add('btn-secondary');
                buyNowBtn.classList.add('w-full');
            }
            if (makeOfferBtn) {
                makeOfferBtn.style.display = 'none';
            }

            // Add Delete Button if creator
            const isCreatedByUser = currentAccount && (nft.creator === currentAccount || nft.isNew);
            if (isCreatedByUser && !document.getElementById('deleteNftBtn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.id = 'deleteNftBtn';
                deleteBtn.className = 'btn-danger flex-1 py-3 rounded-lg font-semibold text-white bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 transition-all';
                deleteBtn.textContent = 'Delete NFT';
                deleteBtn.onclick = () => {
                    if (confirm('Are you sure you want to delete this NFT? This action cannot be undone.')) {
                        mockNftData = mockNftData.filter(n => n.id !== nft.id);
                        localStorage.setItem('nftData', JSON.stringify(mockNftData));
                        alert('NFT deleted successfully.');
                        window.location.href = 'index.html';
                    }
                };

                // If makeOffer is hidden, we can replace it or append
                if (actionContainer) {
                    actionContainer.appendChild(deleteBtn);
                }
            }
        } else {
            // Reset if not owned (e.g. account switch)
            if (buyNowBtn) {
                buyNowBtn.textContent = 'Buy Now';
                buyNowBtn.onclick = () => openPurchaseModal(nft);
                buyNowBtn.classList.remove('w-full');
            }
            if (makeOfferBtn) {
                makeOfferBtn.style.display = 'block';
            }

            // Remove delete button if exists
            const deleteBtn = document.getElementById('deleteNftBtn');
            if (deleteBtn) {
                deleteBtn.remove();
            }
        }
    });


}

function showSellNftModal(nftId) {
    if (!currentAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Create sell modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50';
    modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="modal-content rounded-xl p-6 max-w-md w-full">
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-4">List NFT for Sale</h3>
                    <div class="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="${nft.image}" alt="${nft.name}" class="w-full h-full object-cover">
                    </div>
                    <h4 class="text-xl font-semibold mb-2">${nft.name}</h4>
                    <p class="text-gray-400 mb-4">${nft.collection}</p>
                    
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Sale Price (ETH)</label>
                            <input type="number" id="sellPrice" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter price" step="0.01" min="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Sale Type</label>
                            <select id="saleType" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white">
                                <option value="buy-now">Buy Now</option>
                                <option value="auction">Auction</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex space-x-4">
                        <button onclick="closeSellModal()" class="btn-secondary flex-1 py-3 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button onclick="confirmSell(${nftId})" class="btn-primary flex-1 py-3 rounded-lg font-medium">
                            List for Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate modal entrance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function closeSellModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(modal);
            }
        });
    }
}

function confirmSell(nftId) {
    const sellPrice = document.getElementById('sellPrice').value;
    const saleType = document.getElementById('saleType').value;

    if (!sellPrice || parseFloat(sellPrice) <= 0) {
        alert('Please enter a valid price.');
        return;
    }

    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    (async () => {
        const result = await Market.simulateListByMockId(nftId, sellPrice);
        if (!result.success) {
            alert(result.message || 'Failed to list NFT');
            return;
        }
        alert(`${nft.name} has been listed for sale at ${sellPrice} ETH!`);
        closeSellModal();
        // Reload page to show updates
        window.location.reload();
    })();
}



function openPurchaseModal(nft) {
    if (!currentAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const modal = document.getElementById('purchaseModal');
    // Populate modal... (similar to index.js)
    // For brevity, assuming modal elements exist
    document.querySelector('#modalNftName').textContent = nft.name;
    document.querySelector('#modalNftPrice').textContent = `${nft.price} ${nft.currency}`;

    modal.classList.remove('hidden');
    modal.dataset.nftId = nft.id; // store current NFT id for confirm handler

    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

// ... closePurchaseModal and confirmPurchase ...
// (I will assume the HTML has the onclick handlers set up to call global functions, 
// OR I need to attach them. The HTML has IDs, so I can attach them in setupEventListeners)

document.getElementById('cancelPurchase')?.addEventListener('click', () => {
    const modal = document.getElementById('purchaseModal');
    modal.classList.add('hidden');
});

// Use centralized Market.simulatePurchaseByMockId for consistent behavior
document.getElementById('confirmPurchase')?.addEventListener('click', async () => {
    const modal = document.getElementById('purchaseModal');
    const nftId = parseInt(modal.dataset.nftId);
    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found');
        return;
    }

    // UI Elements
    const confirmBtn = document.getElementById('confirmPurchase');
    const originalText = confirmBtn.textContent;
    const txProgress = document.getElementById('txProgress');
    const txStatus = document.getElementById('txStatus');
    const txBar = document.getElementById('txProgressBar');
    const txHashEl = document.getElementById('txHash');

    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;
    txProgress.classList.remove('hidden');
    txStatus.textContent = 'Awaiting confirmation...';
    txBar.style.width = '10%';
    txHashEl.textContent = '';

    const updateProgress = (value, status) => {
        txBar.style.width = `${value}%`;
        txStatus.textContent = status;
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        updateProgress(35, 'Confirming on chain...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress(70, 'Finalizing transaction...');

        const result = await Market.simulatePurchaseByMockId(nft.id, currentAccount || 'You');
        if (!result.success) {
            alert(result.message || 'Purchase failed');
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            txProgress.classList.add('hidden');
            return;
        }

        updateProgress(100, 'Completed');
        txHashEl.textContent = `Transaction: ${result.txHash}`;
        setTimeout(() => {
            modal.classList.add('hidden');
            alert(`Purchase successful! You now own ${nft.name}.\n\nTransaction Hash: ${result.txHash}`);
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            txProgress.classList.add('hidden');
            window.location.reload();
        }, 800);

    } catch (err) {
        console.error('Purchase failed', err);
        alert('Purchase failed. Please try again.');
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
        txProgress.classList.add('hidden');
    }
});

function initializePriceChart() {
    const chartDom = document.getElementById('priceChart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    // ... chart options (same as before) ...
    const option = {
        backgroundColor: 'transparent',
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { color: 'rgba(255, 255, 255, 0.7)' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { color: 'rgba(255, 255, 255, 0.7)', formatter: '{value} ETH' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [{
            data: [18.5, 19.2, 21.8, 20.5, 22.1, 23.4, 21.9, 24.2, 23.8, 25.1, 24.5, 24.5],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#0066ff', width: 3 },
            itemStyle: { color: '#0066ff' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: 'rgba(0, 102, 255, 0.3)' }, { offset: 1, color: 'rgba(0, 102, 255, 0.05)' }]
                }
            }
        }],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textStyle: { color: '#fafafa' },
            formatter: params => `${params[0].name}<br/>Price: ${params[0].value} ETH`
        }
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
}
