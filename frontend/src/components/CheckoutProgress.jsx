import React from 'react'

const steps = ['Cart', 'Checkout', 'Complete']

const CheckoutProgress = ({ currentStep = 0, className = '' }) => {
  const clampedStep = Math.max(0, Math.min(currentStep, steps.length - 1))

  return (
    <div className={`w-full ${className}`}>
      <div className='flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-1'>
        {steps.map((step, i) => {
          const isActive = i === clampedStep
          const isCompleted = i < clampedStep

          return (
            <React.Fragment key={step}>
              {i > 0 && (
                <div
                  className='w-7 sm:w-10 h-px flex-shrink-0'
                  style={{
                    background: isCompleted
                      ? 'rgba(249,115,22,0.45)'
                      : 'rgba(249,115,22,0.15)'
                  }}
                />
              )}
              <div className='flex items-center gap-2 flex-shrink-0'>
                <div
                  className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200'
                  style={
                    isActive || isCompleted
                      ? { background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' }
                  }
                >
                  {i + 1}
                </div>
                <span
                  className='text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] whitespace-nowrap'
                  style={{ color: isActive || isCompleted ? '#fb923c' : '#475569' }}
                >
                  {step}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default CheckoutProgress
