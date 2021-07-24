import * as React from "react";
import { Helmet } from "react-helmet";
import { getUuidv4 } from "src/utils";

/**
 * default <head> content
 *
 * @param props
 * @returns
 */

const DefaultHead: React.FunctionComponent<{}> = (props) => {
  const [curNonce, setNonce] = React.useState<string>(getUuidv4());

  //React.useEffect(() => {
  //  setNounce(getUuidv4());
  //});

  /**
   * every time you add external link such as Google Adsense and Gogole Analysis, you need to add the domain to this CSP.
   */

  return (
    <Helmet>
      <meta
        http-equiv="Content-Security-Policy"
        content={`default-src 'self'; script-src 'self' https://js.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'nonce-${curNonce}'; img-src 'self' api.iwaodev.com; frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; connect-src 'self' https://api.stripe.com https://api.iwaodev.com`}
      />
      <meta property="csp-nonce" content={curNonce} />
      {/**
       * you can just add 'nonce' in the script tag for reCaptcha and add that nonce in CSP tag.
       * src: https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
       * src: https://stackoverflow.com/questions/39853162/recaptcha-with-content-security-policy
       */}
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
    </Helmet>
  );
};

export default DefaultHead;
