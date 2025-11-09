import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TestGrid = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(
        section,
        { autoAlpha: 0, scale: 0.9 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Shrink & fade out the previous when next comes in
      if (index > 0) {
        gsap.to(sectionsRef.current[index - 1], {
          scale: 0.8,
          autoAlpha: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      }
    });
  }, []);

  return (
    <div>
      {/* Section 1 */}
      <Box
        ref={addToRefs}
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
          className="text-content"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 4,
            textAlign: "center",
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
  ref={addToRefs}
  sx={{
    display: "flex",
    height: "100vh",
    width: "100vw",   // force full desktop width
    flexDirection: { xs: "column", md: "row" },
    backgroundImage:
      "url('https://i.pinimg.com/736x/b7/7a/96/b77a96c72fa03abf25c398e565aec1a1.jpg')",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden", // prevent scrollbar shift issues
  }}
>
  {/* Text Content */}
  <Box
    className="text-content"
    sx={{
      flex: { xs: "unset", md: "1" }, // take half on desktop, full on mobile
      minWidth: { md: "50%" },        // ensures side-by-side on desktop
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      color: "white",
      p: 4,
      textAlign: "center",
    }}
  >
    <Box maxWidth="600px"> {/* keeps text from stretching too wide */}
      <Typography variant="h3" gutterBottom>
        Left Side Text 1
      </Typography>
      <Typography variant="body1">
        This is the first section's text content on the left side.
      </Typography>
    </Box>
  </Box>
</Box>

      {/* Section 3 */}
      <Box
        ref={addToRefs}
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
          className="text-content"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 4,
            textAlign: "center",
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
