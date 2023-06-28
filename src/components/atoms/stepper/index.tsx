import { Stepper as StepperMui, Step, StepLabel } from '@mui/material';

export interface StepperData {
  step: number;
  description: string;
}

export interface EssayStepperData extends StepperData {
  path: string;
}

interface StepperProps {
  activeStep: number;
  stepperData: StepperData[];
  width?: string;
  variant: 'multicolor' | 'standard';
}

const Stepper = ({ stepperData, activeStep, variant }: StepperProps) => {
  return (
    <>
      <StepperMui activeStep={activeStep} alternativeLabel sx={{ width: '100%' }}>
        {stepperData.map((step: StepperData, index: number) => (
          <Step
            key={index}
            sx={{
              '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-completed': {
                color: 'secondaryTons.green',
              },
              '& .MuiStepIcon-text': {
                fill: '#FCFCFC', // primaryTons.mainWhite
              },
              '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
                fontSize: '0.8rem',
                fontWeight: '700',
              },
              '& .MuiStepLabel-label.MuiStepLabel-label.Mui-completed': {
                color: variant === 'multicolor' && 'secondaryTons.green',
              },
              '& .MuiStepLabel-label.MuiStepLabel-label.Mui-active': {
                color: variant === 'multicolor' && 'secondaryTons.main',
              },
            }}
          >
            <StepLabel>{step.description}</StepLabel>
          </Step>
        ))}
      </StepperMui>
    </>
  );
};

export default Stepper;