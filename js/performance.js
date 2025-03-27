// performance.js - Handles performance tracking and visualization

// Import Firebase modules
import { db, auth } from './firebase-config.js';

// Save performance data
function savePerformanceData() {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user logged in');
            return reject(new Error('No user logged in'));
        }

        const speed = document.getElementById('speed').value;
        const heartRate = document.getElementById('heart-rate').value;
        const systolic = document.getElementById('systolic').value;
        const diastolic = document.getElementById('diastolic').value;
        const notes = document.getElementById('notes').value;

        if (!speed || !heartRate || !systolic || !diastolic) {
            alert('Please fill all fields before submitting.');
            return reject(new Error('Incomplete data'));
        }

        db.collection('metrics').add({
            userId: user.uid,
            speed: parseFloat(speed),
            heartRate: parseInt(heartRate),
            systolic: parseInt(systolic),
            diastolic: parseInt(diastolic),
            notes: notes,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Performance data saved');
            document.getElementById('performance-form').reset();
            loadPerformanceHistory();
            resolve();
        })
        .catch(error => {
            console.error('Error saving performance data:', error);
            reject(error);
        });
    });
}

// Load historical performance data
function loadPerformanceHistory() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user logged in.");
        return;
    }

    db.collection('metrics')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                document.getElementById('performance-history').innerHTML = "<tr><td colspan='5'>No records found</td></tr>";
                return;
            }

            let historyHtml = '';
            let chartData = { labels: [], speed: [], heartRate: [] };

            snapshot.forEach(doc => {
                const data = doc.data();
                const date = new Date(data.timestamp.seconds * 1000).toLocaleString();
                historyHtml += `
                    <tr>
                        <td>${data.speed} km/h</td>
                        <td>${data.heartRate} bpm</td>
                        <td>${data.systolic}/${data.diastolic} mmHg</td>
                        <td>${data.notes}</td>
                        <td>${date}</td>
                    </tr>`;
                chartData.labels.unshift(date);
                chartData.speed.unshift(data.speed);
                chartData.heartRate.unshift(data.heartRate);
            });

            document.getElementById('performance-history').innerHTML = historyHtml;
            updatePerformanceChart(chartData);
        })
        .catch(error => console.error("Error loading performance history:", error));
}

// Initialize performance chart
function updatePerformanceChart(data) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    window.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Speed (km/h)',
                    data: data.speed,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true
                },
                {
                    label: 'Heart Rate (bpm)',
                    data: data.heartRate,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            }
        }
    });
}

// Auto-load performance history
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadPerformanceHistory();
        }
    });
});

// Export functions
window.performanceService = { savePerformanceData, loadPerformanceHistory };
