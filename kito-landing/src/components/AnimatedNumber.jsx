import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, formatter = (v) => v, duration = 1500 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    
    // Quick escape if value is 0
    if (endValue === 0) {
      setDisplayValue(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for a snappy start and slow finish
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(easeProgress * endValue); // use Math.round to handle decimals if necessary, but we work mostly with ints here
      
      setDisplayValue(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{formatter(displayValue)}</>;
};

export default AnimatedNumber;
