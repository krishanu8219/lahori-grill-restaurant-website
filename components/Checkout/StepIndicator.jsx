export default function StepIndicator({ currentStep, steps }) {
    return (
        <div className="step-indicator">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                return (
                    <div key={stepNumber} className="step-item">
                        <div className="step-connector-wrapper">
                            {index > 0 && (
                                <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                            )}
                        </div>
                        <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            {isCompleted ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <span>{stepNumber}</span>
                            )}
                        </div>
                        <div className="step-label">
                            <span className="step-title">{step.title}</span>
                            <span className="step-description">{step.description}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
