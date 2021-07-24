import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashLink } from "react-router-hash-link";
import { Link as RRLink } from "react-router-dom";
import { fetchCompanyActionCreator } from "reducers/slices/domain/company";
import { rsSelector } from "src/selectors/selector";
import { toDateString } from "src/utils";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    parag: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    link: {
      textTransform: "uppercase",
      display: "block",
      marginLeft: theme.spacing(1),
    },
    header: {
      fontWeight: theme.typography.fontWeightBold,
      textTransform: "capitalize",
    },
    subheader: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: "1rem",
      textTransform: "capitalize",
      margin: `${theme.spacing(1)}px 0`,
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

/**
 * guest & member order page
 *
 **/
const PrivacyPolicy: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  /**
   * company stuff
   **/
  const curCompany = useSelector(rsSelector.domain.getCompany);
  React.useEffect(() => {
    if (!curCompany) {
      dispatch(fetchCompanyActionCreator());
    }
  }, []);

  if (!curCompany) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Privacy Policy"}
      </Typography>
      <Typography variant="body2" component="p" align="right">
        Last Updated {toDateString(new Date("2021-07-22"))}
      </Typography>
      <b />
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Thank you for choosing to be part of our community at{" "}
        {curCompany.companyName} ("Company", "we", "us", "our"). We are
        committed to protecting your personal information and your right to
        privacy. If you have any questions or concerns about this privacy notice
        or our practices with regards to your personal information, please
        contact us at {curCompany.companyEmail}.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        When you and more generally, use any of our services (the "Services",
        which include the), we appreciate that you are trusting us with your
        personal information. We take your privacy very seriously. In this
        privacy notice, we seek to explain to you in the clearest way possible
        what information we collect, how we use it, and what rights you have in
        relation to it. We hope you take some time to read through it carefully,
        as it is important. If there are any terms in this privacy notice that
        you do not agree with, please discontinue use of our Service
        immediately.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        This privacy notice applies to all information collected through our
        Services (which, as described above, includes our), as well as, any
        related services, sales, marketing, or events.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Please read this privacy notice carefully as it will help you understand
        what we do with the information that we collect.
      </Typography>

      <Typography
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        Table of Contents
      </Typography>
      <HashLink
        smooth
        to="/privacy-policy#what-information-do-we-collect"
        className={classes.link}
      >
        what information do we collect?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#will-your-information-be-shared-with-anyone"
        className={classes.link}
      >
        will your information be shared with anyone?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#do-we-use-cookies-and-other-tracking-technologies"
        className={classes.link}
      >
        do we use cookies and other tracking technologies?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#how-do-we-handle-your-social-logins"
        className={classes.link}
      >
        how do we handle your social logins?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#is-your-information-transferred-internationally"
        className={classes.link}
      >
        is your information transferred internationally?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#how-long-do-we-keep-your-information"
        className={classes.link}
      >
        how long do we keep your information?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#do-we-collect-information-from-minors"
        className={classes.link}
      >
        do we collect information from minors?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#what-are-your-privacy-rights"
        className={classes.link}
      >
        what are your privacy rights?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#controls-for-do-not-track-features"
        className={classes.link}
      >
        controls for do-not-track features
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#do-california-residents-have-specific-privacy-rights"
        className={classes.link}
      >
        do California residents have specific privacy rights?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#do-we-make-updates-to-this-notice"
        className={classes.link}
      >
        do we make updates to this notice?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#how-can-you-contact-us-about-this-notice"
        className={classes.link}
      >
        how can you contact us about this notice?
      </HashLink>
      <HashLink
        smooth
        to="/privacy-policy#how-can-you-review,-update-or-delete-the-data-we-collect-from-you"
        className={classes.link}
      >
        how can you review, update or delete the data we collect from you?
      </HashLink>

      {/** what-information-do-we-collect */}
      <Typography
        id="what-information-do-we-collect"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        what information do we collect?
      </Typography>
      <Typography
        variant="h6"
        component="h6"
        align="left"
        className={classes.subheader}
      >
        Personal information you disclose to use
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: We collect personal information that you provide to us.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We collect personal information that you voluntarily provide to us when
        you register on the express an interest in obtaining information about
        us or our products and service when you participate in activities on the
        (such as by posting messages in our online forums or entering
        competitions, contests or giveaways) or otherwise when you contact us.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        the personal information that we collect depends on the context of your
        interactions with us and the choices you make and the products and
        features you use. the personal information we collect may include the
        following.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>Social media login data</b>: We may provide you with the option to
        register with us using your existing social media account details, like
        your Facebook, Twitter, or other social media account. If you choose to
        register in this way, we will collect the information described in the
        section called{" "}
        <HashLink
          to={"/privacy-policy#how-do-we-handle-your-social-logins"}
          smooth
        >
          how do we handle your social logins?
        </HashLink>
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        All personal information that you provide to us must be true, complete,
        and accurate, and you must notify us of any changes to such personal
        information.
      </Typography>

      <Typography
        variant="h6"
        component="h6"
        align="left"
        className={classes.subheader}
      >
        information automatically collected
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: Some information - such as your Internet Protocol (IP)
        address and/or browser and device characteristics - is collected
        automatically when you visit ours.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        we automatically collect certain information when you visit, use or
        navigate our website. This information does not reveal your specific
        identity (like your name or contact information) but may include device
        and usage information, such as your IP address, browser, and device
        characteristics, operating system, language preferences, referring URLs,
        device name, country, location, information about how and when you use
        our and other technical information. This information is primarily
        needed to maintain the security and operation of ours, and for our
        internal analytics and reporting purposes.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Like many businesses, we also collect information through cookies and
        similar technologies.
      </Typography>

      {/** will-your-information-be-shared-with-anyone */}
      <Typography
        id="will-your-information-be-shared-with-anyone"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        will your information be shared with anyone?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: We only share information with your consent, to comply
        with laws, to provide you with services, to protect your rights, or to
        fulfill business obligations.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We may process or share your data that we hold based on the following
        legal basis. More specifically, we may need to process your data or
        share your personal information in the following situations:
      </Typography>

      <ul>
        <li>
          <b>Business Transfers</b>. We may share or transfer your information
          in connection with, or during negotiations of, any merger, sale of
          company assets, financing, or acquisition of all or a portion of our
          business to another company.
        </li>
        <li>
          <b>Business Transfers</b>. We may share or transfer your information
          in connection with, or during negotiations of, any merger, sale of
          company assets, financing, or acquisition of all or a portion of our
          business to another company.
        </li>
        <li>
          <b>Affiliates</b>. we may share your information with our affiliates,
          in which case we will require those affiliates to honor this privacy
          notice. affiliates include our parent company and any subsidiaries,
          joint venture partners, or other companies that we control or that are
          under common control with us.
        </li>
        <li>
          <b>Business partners</b>. We may share your information with our
          business partners to offer you certain products, services, or
          promotions.
        </li>
        <li>
          <b>Other users</b>. when you share personal information or otherwise
          interact with public areas of our website, such personal information
          may be viewed by all users and may be publicly made available outside
          the in perpetuity. If you interact with other users of our and
          register for us through a social network (such as Facebook). your
          contacts on the social network will see your name, profile photo, and
          descriptions of your activity. similarly, other users will be able to
          view descriptions of your activity, communicate with you within our
          website, and view your profile.
        </li>
      </ul>

      {/** do-we-use-cookies-and-other-tracking-technologies */}
      <Typography
        id="do-we-use-cookies-and-other-tracking-technologies"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        do we use cookies and other tracking technologies?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: We may use cookies and other tracking technologies to
        collect and store your information.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We may use cookies and similar tracking technologies (like web beacons
        and pixels) to access or store information. Specific information about
        how we use such technologies and how you can refuse certain cookies is
        set out in our Cookie Notice.
      </Typography>

      {/** how-do-we-handle-your-social-logins */}
      <Typography
        id="how-do-we-handle-your-social-logins"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        how do we handle your social logins?
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: If you choose to register or login into our service
        using a social media account, we may have access to certain information
        about you.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Our offers you the ability to register and log in using your third-party
        social media account details (like your Facebook or Twitter logins).
        Where you choose to do this, we will receive certain profile information
        about you from your social media provider. the profile information we
        receive may vary depending on the social media provider concerned, but
        will often include your name, email address, friends list, profile
        picture as well as other information you choose to make public on such
        social media platform.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We will use the information we receive only for the purposes that are
        described in this privacy notice or that are otherwise made clear to you
        on the relevant. please note that we do not control, and are not
        responsible for, other uses of your personal information by your
        third-party social media provider. we recommend that you review their
        privacy notice to understand how they collect, use and share your
        personal information, and how you can set your privacy preferences on
        their sites and apps.
      </Typography>

      {/** is-your-information-transferred-internationally */}
      <Typography
        id="is-your-information-transferred-internationally"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        is your information transferred internationally?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: We may transfer, store, and process your information in
        countries other than your own.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Our servers are located in Canada. If you are accessing our form
        outside, please be aware that your information may be transferred to,
        stored, and processed by us in our facilities and by those third parties
        with whom we may share your personal information (see{" "}
        <HashLink
          to="/privacy-policy#will-your-information-be-shared-with-anyone"
          smooth
        >
          will your information be shared with anyone?
        </HashLink>{" "}
        above), in and other countries.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you are a resident in the European Economic Area (EEA) or United
        Kingdom (UK), then these countries may not necessarily have data
        protection laws or other similar laws as comprehensive as those in your
        country. We will however take all necessary measures to protect your
        personal information in accordance with this privacy notice and
        applicable law.
      </Typography>

      {/** how-long-do-we-keep-your-information */}
      <Typography
        id="how-long-do-we-keep-your-information"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        how long do we keep your information?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>I Short</b>: We keep your information for as long as necessary to
        fulfill the purposes outlined in this privacy notice unless otherwise
        required by law.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We will only keep your personal information for as long as it is
        necessary for the purpose set out in this privacy notice unless a longer
        retention period is required or permitted by law (such as tax,
        accounting, or other legal requirements).
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        When we have no ongoing legitimate business need to process your
        personal information, we will either delete or anonymize such
        information or, if this is not possible (for example, because your
        personal information has been stored in backup archives), then we will
        securely store your personal information and isolate it from any further
        processing until deletion is possible.
      </Typography>

      {/** do-we-collect-information-from-minors */}
      <Typography
        id="do-we-collect-information-from-minors"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        do we collect information from minors?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: We do not knowingly collect data from or market to
        children under 18 years of age.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        By using our website, you represent that you are at least 18 or that you
        are the parent or guardian of such a minor and consent to such minor
        dependent's use of our website. If we learn that personal information
        from users less than 18 years of age has been collected, we will
        deactivate the account and take reasonable measures to promptly delete
        such data from our records. if you become aware of any data we may have
        collected from children under age 18, please contact us at{" "}
        {curCompany.companyEmail}.
      </Typography>

      {/** what-are-your-privacy-rights */}
      <Typography
        id="what-are-your-privacy-rights"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        what are your privacy rights?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: You may review, change, or terminate your account at
        any time.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you are a resident in the EEA or UK and you believe we are unlawfully
        processing your personal information, you also have the right to
        complain to your local data protection supervisory authority. you can
        find their contact details here:{" "}
        <a
          href="https://ec.europa.eu/newsroom/article29/items/612080"
          target="_blank"
        >
          https://ec.europa.eu/newsroom/article29/items/612080
        </a>
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you are a resident in Switzerland, the contact details for the data
        protection authorities are available here:
        <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" target="_blank">
          https://www.edoeb.admin.ch/edoeb/en/home.html
        </a>
      </Typography>

      <Typography
        variant="h6"
        component="h6"
        align="left"
        className={classes.subheader}
      >
        Account Information
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you would at any time like to review or change the information in
        your account or terminate your account, you can:
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Upon your request to terminate your account, we will deactivate or
        delete your account and information from our active databases. However,
        we may retain some information in our files to prevent fraud,
        troubleshoot problems, assist with any investigations, enforce our Terms
        of User, and/or comply with applicable legal requirements.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Opting out of email marketing: you can unsubscribe from our marketing
        email list at any time by clicking on the unsubscribe link in the emails
        that we send or by contacting us using the details provided below. You
        will then be removed from the marketing email list - however, we may
        still communicate with you, for example, to send you service-related
        emails that are necessary for the administration and use of your
        account, to respond to service requests, or for other non-marketing
        purposes. To otherwise opt-out, you may:
      </Typography>

      {/** controls-for-do-not-track-features */}
      <Typography
        id="controls-for-do-not-track-features"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        controls for do-not-track features
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Most web browsers and some mobile operating systems and mobile
        applications include a Do-Not-Track ("DNT") feature or setting you can
        activate to signal your privacy preference not to have data about your
        online browsing activities monitored and collected. At this stage, no
        uniform technology standard for recognizing and implementing DNT signals
        has been finalized. as such, we do not currently respond to DNT browser
        signals or any other mechanism that automatically communicates your
        choice not to be tracked online. If a standard for online tracking is
        adopted that we must follow in the future, we will inform you about that
        practice in a revised version of this privacy notice.
      </Typography>

      {/** do-california-residents-have-specific-privacy-rights */}
      <Typography
        id="do-california-residents-have-specific-privacy-rights"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        do California residents have specific privacy rights?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: Yes, if you are a resident of California, you are
        granted specific rights regarding access to your personal information.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        California Civil Code Section 1798.83, also known as the "Shine The
        Light" law, permits our users who are California residents to request
        and obtain from us, once a year and free of charge, information about
        categories of personal information (if any) we disclosed to third
        parties for direct marketing purposes and the names and addresses of all
        third parties with which we shared personal information in the
        immediately preceding calendar year. if you are a California resident
        and would like to make such a request, please submit your request in
        writing to us using the contact information provided below.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you are under 18 years of age, reside in California, and have a
        registered account with our website, you have the right to request the
        removal of unwanted data that you publicly post on our website. To
        request the removal of such data, please contact us using the contact
        information provided below, and include the email address associated
        with your account and a statement that you reside in California. We will
        make sure the data is not publicly displayed on our website, but please
        be aware that the data may not be completely or comprehensively removed
        from all our systems (e.g., backups, etc.).
      </Typography>

      {/** do-we-make-updates-to-this-notice */}
      <Typography
        id="do-we-make-updates-to-this-notice"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        do we make updates to this notice?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        <b>In Short</b>: Yes, we will update this notice as necessary to say
        compliant with relevant laws.
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        We may update this privacy notice from time to time. the updated version
        will be indicated by an updated "Revised" date and the updated version
        will be effective as soon as it is accessible. if we make material
        changes to this privacy notice, we may notify you either by prominently
        posting a notice of such changes or by directly sending you a
        notification. we encourage you to review this privacy notice frequently
        to be informed of how we are protecting your information.
      </Typography>

      {/** how-can-you-contact-us-about-this-notice */}
      <Typography
        id="how-can-you-contact-us-about-this-notice"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        how can you contact us about this notice?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you have questions or comments about this notice, you may email us at{" "}
        {curCompany.companyEmail}.
      </Typography>

      {/** how-can-you-review,-update-or-delete-the-data-we-collect-from-you */}
      <Typography
        id="how-can-you-review,-update-or-delete-the-data-we-collect-from-you"
        variant="h6"
        component="h6"
        align="left"
        className={classes.header}
      >
        how can you review, update or delete the data we collect from you?
      </Typography>

      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Based on the applicable laws of your country, you may have the right to
        request access to the personal information we collect from you, change
        that information, or delete it in some circumstances. to request to
        review, update, or delete your personal information, please submit a
        request form by clicking <RRLink to="/contact">here</RRLink>
      </Typography>
    </React.Fragment>
  );
};

export default PrivacyPolicy;
