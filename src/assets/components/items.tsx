import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TestGrid = () => {
  return (
    <div>
      {/* Section 1 */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundImage:
            "url('https://i.pinimg.com/736x/b7/7a/96/b77a96c72fa03abf25c398e565aec1a1.jpg')",
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent overlay
            color: 'white',
            p: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Left Side Text 1
            </Typography>
            <Typography variant="body1">
              This is the first section's text content on the left side.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Section 2 */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundImage:
            "url('https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg')",
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Right Side Text 2
            </Typography>
            <Typography variant="body1">
              This is the second section's text content on the right side.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Section 3 */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundImage:
            "url('https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg')",
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Left Side Text 3
            </Typography>
            <Typography variant="body1">
              This is the third section's text content on the left side.
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default TestGrid;
