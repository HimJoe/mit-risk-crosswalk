// MIT Risk Repository Framework Crosswalk Portal
// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Framework Search Functionality
    document.getElementById('frameworkSearch').addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const frameworkCards = document.querySelectorAll('.framework-card-container');
        
        frameworkCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Risk Category Filtering
    document.getElementById('riskCategoryFilter').addEventListener('change', function() {
        const selectedCategory = this.value;
        const riskItems = document.querySelectorAll('.risk-item');
        
        riskItems.forEach(item => {
            if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Framework Comparison Functionality
    const frameworkCheckboxes = document.querySelectorAll('.framework-checkbox');
    frameworkCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateComparisonChart);
    });

    // Initialize the comparison chart
    initializeComparisonChart();
});

// Initialize the framework comparison chart
function initializeComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    window.comparisonChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['General Risks', 'Technical Risks', 'Governance Risks', 'Operational Risks', 'Compliance Risks'],
            datasets: [{
                label: 'NIST AI RMF',
                data: [3, 2, 3, 2, 2],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 3,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Update the comparison chart based on selected frameworks
function updateComparisonChart() {
    const selectedFrameworks = [];
    const frameworkCheckboxes = document.querySelectorAll('.framework-checkbox:checked');
    
    frameworkCheckboxes.forEach(checkbox => {
        const framework = checkbox.value;
        let data = [];
        
        switch(framework) {
            case 'nist':
                data = [3, 2, 3, 2, 2];
                break;
            case 'eu':
                data = [3, 1, 2, 1, 3];
                break;
            case 'iso':
                data = [2, 1, 3, 3, 2];
                break;
            case 'singapore':
                data = [3, 2, 2, 2, 1];
                break;
            case 'msft':
                data = [3, 2, 2, 2, 1];
                break;
            case 'ibm':
                data = [2, 3, 1, 1, 1];
                break;
            default:
                data = [0, 0, 0, 0, 0];
        }
        
        const colors = {
            'nist': 'rgba(52, 152, 219, 1)',
            'eu': 'rgba(241, 196, 15, 1)',
            'iso': 'rgba(155, 89, 182, 1)',
            'singapore': 'rgba(231, 76, 60, 1)',
            'msft': 'rgba(39, 174, 96, 1)',
            'ibm': 'rgba(52, 73, 94, 1)'
        };
        
        selectedFrameworks.push({
            label: checkbox.dataset.name,
            data: data,
            backgroundColor: colors[framework].replace('1)', '0.2)'),
            borderColor: colors[framework],
            borderWidth: 2
        });
    });
    
    window.comparisonChart.data.datasets = selectedFrameworks;
    window.comparisonChart.update();
}

// Load framework data from JSON
async function loadFrameworkData() {
    try {
        const response = await fetch('data/frameworks.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading framework data:', error);
        return {};
    }
}

// Load risk data from JSON
async function loadRiskData() {
    try {
        const response = await fetch('data/risks.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading risk data:', error);
        return {};
    }
}

// Export functionality for the crosswalk data
function exportCrosswalkData(format) {
    // Placeholder for export functionality
    alert(`Exporting data in ${format} format. This feature will download the complete mapping data.`);
}

// Function to show framework details modal
function showFrameworkDetails(frameworkId) {
    // Get framework data
    loadFrameworkData().then(frameworks => {
        const framework = frameworks[frameworkId] || {};
        
        // Update modal content
        document.getElementById('frameworkModalLabel').textContent = framework.name || 'Framework Details';
        document.getElementById('frameworkDescription').textContent = framework.description || '';
        
        // Show the modal
        const frameworkModal = new bootstrap.Modal(document.getElementById('frameworkModal'));
        frameworkModal.show();
    });
}
