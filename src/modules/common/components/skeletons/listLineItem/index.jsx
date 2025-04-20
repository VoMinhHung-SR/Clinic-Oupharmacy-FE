import React from 'react';
import { Skeleton, Stack } from '@mui/material';

const SkeletonListLineItem = ({ 
  count = 1,
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  className = ''
}) => {
  return (
    <Stack spacing={1} className={className}>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation="pulse"
          sx={{
            borderRadius: variant === 'circular' ? '50%' : 
                         variant === 'text' ? '4px' : '8px',
            bgcolor: 'grey.200'
          }}
        />
      ))}
    </Stack>
  );
};

export default SkeletonListLineItem;