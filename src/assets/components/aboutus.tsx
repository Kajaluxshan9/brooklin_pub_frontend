import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Nav from './nav';

const TestGrid = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Nav />

      {/* Section 1 */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* Left Text */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
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

        {/* Right Image (fixed) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            backgroundImage:
              "url('https://i.pinimg.com/736x/b7/7a/96/b77a96c72fa03abf25c398e565aec1a1.jpg')",
            backgroundRepeat: 'no-repeat',   
            backgroundSize: 'auto',  
            backgroundPosition: 'right',
            backgroundAttachment: 'fixed',
          }}
        />
      </Box>

      {/* Section 2 */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* Left Image (fixed + repeat) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            backgroundImage:
              "url('https://i.pinimg.com/736x/b0/2f/c8/b02fc86b1a599455dfb134e44b033b02.jpg')",
            backgroundRepeat: 'no-repeat',   
            backgroundSize: 'auto',       
            backgroundPosition: 'top left',
            backgroundAttachment: 'fixed',
          }}
        />

        {/* Right Text */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'secondary.main',
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
          width: '100vw',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* Left Text */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
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

        {/* Right Image (fixed) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            backgroundImage:
              "url('https://i.pinimg.com/736x/42/2c/2e/422c2e649799697f1d1355ba8f308edd.jpg')",
            backgroundRepeat: 'no-repeat',   
            backgroundSize: 'auto',  
            backgroundPosition: 'right',
            backgroundAttachment: 'fixed',
          }}
        />
      </Box>
    </div>
  );
};

export default TestGrid;
