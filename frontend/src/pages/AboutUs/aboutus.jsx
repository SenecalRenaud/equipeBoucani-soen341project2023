import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
    backgroundColor: "#333333", //theme.palette.secondary.main,
  },
  section: {
    width: "100%",
    maxWidth: 800,
    margin: theme.spacing(4, 0),
    padding: theme.spacing(4),
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  heading: {
    color: "#FF4820", //theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  paragraph: {
    color: "#333333",
    marginBottom: theme.spacing(2),
  },
}));
const AboutUs = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.heading}>
        About Boucani Job Center
      </Typography>

      <div className={classes.section}>
        <Typography variant="h4" className={classes.heading}>
          Our Mission
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          At Boucani Job Center, our mission is to connect students, graduates,
          and job seekers with meaningful career opportunities. We believe that
          everyone deserves access to high-quality job listings and resources,
          regardless of their experience level or background.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h4" className={classes.heading}>
          Our Values
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Accessibility:</strong> We strive to make our website and
              services accessible to all users, including those with
              disabilities.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Transparency:</strong> We believe in being transparent
              about our policies and procedures, and in providing clear and
              accurate information to our users.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Inclusivity:</strong> We are committed to creating a
              welcoming and inclusive environment for all users, regardless of
              their race, gender, religion, or background.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Innovation:</strong> We are always looking for new and
              innovative ways to improve our services and better serve our
              users.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Security:</strong> We take the security of our users'
              information very seriously, and we use the latest technology and
              best practices to ensure that our website and databases are
              secure.
            </Typography>
          </li>
        </ul>
      </div>

      <div className={classes.section}>
        <Typography variant="h4" className={classes.heading}>
          Our Team
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Our team is made up of experienced professionals from a variety of
          backgrounds, including HR, software development, and marketing. We are
          passionate about helping job seekers and employers connect, and we are
          committed to providing the best possible experience for our users.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h4" className={classes.heading}>
          Contact Us
        </Typography>
        <p>
          If you have any questions or comments about Boucani Job Center, please
          don't hesitate to contact us. You can reach us by email at
          info@boucanijobcenter.com, or by phone at 555-555-5555. We look
          forward to hearing from you!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
