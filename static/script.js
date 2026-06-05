document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const modal = document.getElementById('resultModal');
    const closeBtn = document.querySelector('.close');
    const modalCloseBtn = document.querySelector('.modal-close-button');

    // Update slider values
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            valueDisplay.textContent = value.toFixed(1);
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable button and show loading state
        const submitBtn = form.querySelector('.submit-button');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                loss_of_other_interests: formData.get('loss_of_other_interests') === 'true',
                withdrawal_symptoms: formData.get('withdrawal_symptoms') === 'true',
                continued_despite_problems: formData.get('continued_despite_problems') === 'true',
                academic_work_performance: formData.get('academic_work_performance'),
                sleep_disruption_frequency: formData.get('sleep_disruption_frequency'),
                social_isolation_score: parseFloat(formData.get('social_isolation_score')),
                daily_gaming_hours: parseFloat(formData.get('daily_gaming_hours')),
                sleep_hours: parseFloat(formData.get('sleep_hours')),
                monthly_game_spending_usd: parseFloat(formData.get('monthly_game_spending_usd'))
            };

            // Validate total hours
            const totalHours = data.daily_gaming_hours + data.sleep_hours;
            if (totalHours > 24) {
                alert(`Invalid total hours: gaming (${data.daily_gaming_hours}) + sleep (${data.sleep_hours}) = ${totalHours}, must not exceed 24`);
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                return;
            }

            // Send request to API
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to get prediction');
            }

            const result = await response.json();
            displayResult(result.prediction);

        } catch (error) {
            alert('Error: ' + error.message);
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // Display result in modal
    function displayResult(prediction) {
        const resultContent = document.getElementById('resultContent');
        
        // Parse prediction
        let resultClass = '';
        let riskLevel = '';
        
        if (typeof prediction === 'string') {
            prediction = prediction.toLowerCase();
        } else {
            prediction = String(prediction).toLowerCase();
        }

        // Determine risk level based on prediction value
        if (prediction.includes('high') || prediction === '1') {
            resultClass = 'result-high';
            riskLevel = 'HIGH RISK';
        } else if (prediction.includes('medium') || prediction.includes('moderate') || prediction === '2') {
            resultClass = 'result-medium';
            riskLevel = 'MEDIUM RISK';
        } else if (prediction.includes('low') || prediction === '0') {
            resultClass = 'result-low';
            riskLevel = 'LOW RISK';
        } else {
            riskLevel = 'MODERATE RISK';
            resultClass = 'result-medium';
        }

        // Get form values for summary
        const formData = new FormData(form);
        const gamingHours = parseFloat(formData.get('daily_gaming_hours'));
        const sleepHours = parseFloat(formData.get('sleep_hours'));
        const spending = parseFloat(formData.get('monthly_game_spending_usd'));
        const lossOfInterests = formData.get('loss_of_other_interests') === 'true';
        const withdrawal = formData.get('withdrawal_symptoms') === 'true';
        const continued = formData.get('continued_despite_problems') === 'true';
        const academicPerformance = formData.get('academic_work_performance');
        const sleepDisruption = formData.get('sleep_disruption_frequency');
        const isolation = parseFloat(formData.get('social_isolation_score'));

        // Build result HTML
        let resultHTML = `
            <p><strong>Risk Level: <span class="${resultClass}">${riskLevel}</span></strong></p>
            <hr style="margin: 1rem 0;">
            <p><strong>📊 Assessment Summary:</strong></p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <li>Daily Gaming: ${gamingHours} hours</li>
                <li>Sleep Hours: ${sleepHours} hours</li>
                <li>Monthly Spending: $${spending.toFixed(2)}</li>
                <li>Academic Performance: ${academicPerformance}</li>
                <li>Sleep Disruption: ${sleepDisruption}</li>
                <li>Social Isolation: ${isolation}/10</li>
                <li>Loss of Interests: ${lossOfInterests ? 'Yes' : 'No'}</li>
                <li>Withdrawal Symptoms: ${withdrawal ? 'Yes' : 'No'}</li>
                <li>Gaming Despite Problems: ${continued ? 'Yes' : 'No'}</li>
            </ul>
            <hr style="margin: 1rem 0;">
        `;

        // Add recommendations based on risk level
        if (riskLevel === 'HIGH RISK') {
            resultHTML += `
                <p><strong>⚠️ Recommendations:</strong></p>
                <ul style="margin-left: 1.5rem;">
                    <li>Consider seeking professional help immediately</li>
                    <li>Talk to a counselor or therapist specializing in gaming addiction</li>
                    <li>Establish strict boundaries on gaming time</li>
                    <li>Join a support group for gaming addiction</li>
                    <li>Inform family members about your situation</li>
                </ul>
            `;
        } else if (riskLevel === 'MEDIUM RISK') {
            resultHTML += `
                <p><strong>⚠️ Recommendations:</strong></p>
                <ul style="margin-left: 1.5rem;">
                    <li>Monitor your gaming habits closely</li>
                    <li>Set daily time limits for gaming</li>
                    <li>Engage in other recreational activities</li>
                    <li>Improve sleep hygiene and maintain consistent sleep schedule</li>
                    <li>Consider talking to a counselor if issues persist</li>
                </ul>
            `;
        } else {
            resultHTML += `
                <p><strong>✅ Recommendations:</strong></p>
                <ul style="margin-left: 1.5rem;">
                    <li>Continue maintaining healthy gaming habits</li>
                    <li>Keep balancing gaming with other activities</li>
                    <li>Maintain social connections and physical activity</li>
                    <li>Monitor your habits regularly for any changes</li>
                </ul>
            `;
        }

        resultContent.innerHTML = resultHTML;
        modal.classList.add('show');
    }

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    modalCloseBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Home page link
    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            // Let it navigate normally
        });
    }
});
