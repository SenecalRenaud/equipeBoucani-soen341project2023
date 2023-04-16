import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "lightslategrey", //theme.palette.background.paper,
    padding: theme.spacing(4),
    minHeight: "calc(100vh - 64px)",
    maxWidth: "85%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
    color: "#b45805",
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: theme.spacing(4),
    color: "#1e1e1e",
  },
  caseStudy: {
    marginTop: theme.spacing(2),
  },
  caseTitle: {
    fontWeight: "bold",
    color: "#b9651e",
    marginBottom: theme.spacing(2),
  },
}));

export default function PrivacyPolicy() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.title}>
        Privacy and Policy
      </Typography>
      <Typography variant="h5" className={classes.subtitle}>
        Introduction
      </Typography>
      <Typography variant="body1">
        At Boucani Job Center, we take your privacy and security seriously. We
        are committed to protecting your personal information and ensuring that
        your job search experience is safe and secure.
      </Typography>
      <Typography variant="h5" className={classes.subtitle}>
        Data Collection and Usage
      </Typography>
      <Typography variant="body1">
        When you use Boucani Job Center, we may collect certain information
        about you, including your name, email address, location, and job
        preferences. This information is used to provide you with a better job
        search experience and to improve our services. We may also use this
        information to communicate with you about job opportunities and other
        relevant information.
      </Typography>
      <Typography variant="body1">
        We will never sell or share your personal information with third parties
        without your explicit consent. We use secure databases and tokens to
        protect your personal information from unauthorized access or
        disclosure.
      </Typography>
      <Typography variant="h5" className={classes.subtitle}>
        Cookies and Tracking Technologies
      </Typography>
      <Typography variant="body1">
        We use cookies and other tracking technologies to improve your user
        experience on Boucani Job Center. Cookies allow us to remember your
        preferences and to provide you with personalized job recommendations. We
        may also use cookies for advertising purposes.
      </Typography>
      <hr />
      <hr />
      <Typography variant="h5" className={classes.subtitle}>
        Case Studies
      </Typography>
      <div className={classes.caseStudy}>
        <Typography variant="h6" className={classes.caseTitle}>
          Case Study 1: Jane's Job Search
        </Typography>
        <Typography variant="body1">
          Jane was a recent graduate looking for her first job. She signed up
          for Boucani Job Center and started browsing job postings. She applied
          for several jobs and was eventually offered a position at a top
          company.
        </Typography>
        <Typography variant="body1">
          Boucani Job Center helped Jane to find her dream job and kickstart her
          career. We take pride in helping job seekers like Jane to achieve
          their goals.
        </Typography>
      </div>
    </div>
  );
}
