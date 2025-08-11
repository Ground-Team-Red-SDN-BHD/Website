// Aviation Operations Dashboard JavaScript

class AviationDashboard {
    constructor() {
        // Operational data from the provided JSON
        this.operationalData = {
            dates: ["06 Jul 2025", "13 Jul 2025", "20 Jul 2025", "27 Jul 2025"],
            categories: {
                administrative: {
                    "BACK OFFICE": [45, 52, 48, 50],
                    "ACC": [38, 42, 40, 44]
                },
                aircraft_handling: {
                    "AH NB": [180, 195, 175, 190],
                    "AH WB": [120, 135, 125, 140],
                    "BH": [160, 175, 165, 180]
                },
                technical_ops: {
                    "RAMP TECH": [85, 92, 88, 95],
                    "AIC": [25, 30, 28, 32],
                    "LC": [35, 40, 38, 42]
                },
                ground_ops: {
                    "CTOW": [65, 72, 68, 75]
                },
                flight_ops_center: {
                    "FOCA AH": [55, 62, 58, 65],
                    "FOCA BH": [48, 55, 52, 58]
                }
            }
        };

        // Chart color palette
        this.colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
        
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeDashboard());
        } else {
            this.initializeDashboard();
        }
    }

    initializeDashboard() {
        this.calculateSummaryStats();
        this.createAllCharts();
        this.generatePanelStats();
        this.animateElements();
    }

    calculateSummaryStats() {
        let totalOperations = 0;
        
        // Calculate total operations across all categories
        Object.values(this.operationalData.categories).forEach(area => {
            Object.values(area).forEach(categoryData => {
                totalOperations += categoryData.reduce((sum, value) => sum + value, 0);
            });
        });

        const weeklyAverage = Math.round(totalOperations / 4);

        // Update summary cards
        document.getElementById('totalOperations').textContent = totalOperations.toLocaleString();
        document.getElementById('avgWeekly').textContent = weeklyAverage.toLocaleString();
    }

    createAllCharts() {
        // Create chart for each operational area
        this.createAreaChart('adminChart', 'administrative', 'Administrative Operations');
        this.createAreaChart('aircraftChart', 'aircraft_handling', 'Aircraft Handling Operations');
        this.createAreaChart('technicalChart', 'technical_ops', 'Technical Operations');
        this.createAreaChart('groundChart', 'ground_ops', 'Ground Operations');
        this.createAreaChart('flightOpsChart', 'flight_ops_center', 'Flight Operations Center');
    }

    createAreaChart(canvasId, areaKey, title) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const areaData = this.operationalData.categories[areaKey];
        const datasets = [];
        let colorIndex = 0;

        // Create dataset for each category in the area
        Object.keys(areaData).forEach(categoryName => {
            datasets.push({
                label: categoryName,
                data: areaData[categoryName],
                borderColor: this.colors[colorIndex % this.colors.length],
                backgroundColor: this.colors[colorIndex % this.colors.length] + '20',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: this.colors[colorIndex % this.colors.length],
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            });
            colorIndex++;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.operationalData.dates,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Week Ending',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 250,
                        title: {
                            display: true,
                            text: 'Operations Count',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 11
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        cornerRadius: 6,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} operations`;
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        borderCapStyle: 'round',
                        borderJoinStyle: 'round'
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutCubic'
                }
            }
        });
    }

    generatePanelStats() {
        const areas = {
            adminStats: 'administrative',
            aircraftStats: 'aircraft_handling',
            technicalStats: 'technical_ops',
            groundStats: 'ground_ops',
            flightOpsStats: 'flight_ops_center'
        };

        Object.keys(areas).forEach(statsId => {
            const areaKey = areas[statsId];
            const areaData = this.operationalData.categories[areaKey];
            const statsContainer = document.getElementById(statsId);
            
            if (!statsContainer) return;

            let statsHTML = '';
            Object.keys(areaData).forEach(categoryName => {
                const categoryData = areaData[categoryName];
                const total = categoryData.reduce((sum, value) => sum + value, 0);
                const average = Math.round(total / categoryData.length);
                
                statsHTML += `
                    <div class="stat-item">
                        <span class="stat-value">${total}</span>
                        <span class="stat-label">${categoryName} Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${average}</span>
                        <span class="stat-label">${categoryName} Avg</span>
                    </div>
                `;
            });

            statsContainer.innerHTML = statsHTML;
        });
    }

    animateElements() {
        // Add fade-in animation to elements
        const animatedElements = document.querySelectorAll('.summary-card, .chart-panel, .insight-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Animate summary numbers
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.summary-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/,/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    // Method to refresh all charts (useful for updates)
    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.update();
        });
    }

    // Method to get chart data for export or analysis
    getChartData(areaKey) {
        return this.operationalData.categories[areaKey];
    }

    // Method to calculate trends for each category
    calculateTrends() {
        const trends = {};
        
        Object.keys(this.operationalData.categories).forEach(areaKey => {
            trends[areaKey] = {};
            const areaData = this.operationalData.categories[areaKey];
            
            Object.keys(areaData).forEach(categoryName => {
                const data = areaData[categoryName];
                const firstValue = data[0];
                const lastValue = data[data.length - 1];
                const percentChange = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
                
                trends[areaKey][categoryName] = {
                    start: firstValue,
                    end: lastValue,
                    change: lastValue - firstValue,
                    percentChange: percentChange + '%',
                    direction: lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable'
                };
            });
        });
        
        return trends;
    }

    // Method to highlight specific data points
    highlightDataPoint(chartId, datasetIndex, pointIndex) {
        const chart = this.charts[chartId];
        if (chart) {
            chart.setActiveElements([{datasetIndex, index: pointIndex}]);
            chart.update('none');
        }
    }
}

// Initialize dashboard when DOM is ready
let aviationDashboard;

document.addEventListener('DOMContentLoaded', () => {
    aviationDashboard = new AviationDashboard();
    
    // Add additional interactive features
    initializeInteractiveFeatures();
});

function initializeInteractiveFeatures() {
    // Add hover effects to chart panels
    const chartPanels = document.querySelectorAll('.chart-panel');
    chartPanels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.borderColor = 'var(--color-primary)';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.borderColor = 'var(--color-card-border)';
        });
    });

    // Add click-to-expand functionality for insights
    const insightItems = document.querySelectorAll('.insight-item');
    insightItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toLocaleString();
}

// Utility function to calculate percentage change
function calculatePercentageChange(oldValue, newValue) {
    return ((newValue - oldValue) / oldValue * 100).toFixed(1);
}

// Export for potential external use
window.AviationDashboard = AviationDashboard;