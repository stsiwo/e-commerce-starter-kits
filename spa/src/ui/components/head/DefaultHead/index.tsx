import * as React from "react";
import { Helmet } from "react-helmet";
import { getNonce, getUuidv4 } from "src/utils";

/**
 * default <head> content
 *
 * @param props
 * @returns
 */

const DefaultHead: React.FunctionComponent<{}> = (props) => {
  const [curNonce, setNonce] = React.useState<string>(getNonce());

  //React.useEffect(() => {
  //  setNounce(getUuidv4());
  //});

  /**
   * every time you add external link such as Google Adsense and Gogole Analysis, you need to add the domain to this CSP.
   */

  /**
   * TODO: Material-UI with DataGrid complains CSP.
   *
   * error: Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-NDU4ZDZhYWYtNTNjOS00YjZhLTg5ZjEtMmM0ZjdiOTNmZjIy'". Either the 'unsafe-inline' keyword, a hash ('sha256-zRov+xUGJ/uvnA8bUk72Bu/FQ7Uk11WaDIOM4b+hpX0='), or a nonce ('nonce-...') is required to enable inline execution.
   *
   * problem: even if i set nonce for style-src and script-src, it still complains and i guees this is a bug of DataGrid. so if it is fixed, please remove the 'unsafe-inline' from the below policy.
   *
   * note: 'unsafe-inline' is ignored if nonce or hash exist.
   */

  return (
    <Helmet>
      <meta
        http-equiv="Content-Security-Policy"
        content={`default-src 'self'; script-src 'self' https://js.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ 'nonce-${curNonce}'; style-src 'self' 'unsafe-inline' ; img-src 'self' api.iwaodev.com; frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; connect-src 'self' https://api.stripe.com https://api.iwaodev.com`}
      />
      <meta property="csp-nonce" content={curNonce} />
      {/**
       * you can just add 'nonce' in the script tag for reCaptcha and add that nonce in CSP tag.
       * src: https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha
       * src: https://stackoverflow.com/questions/39853162/recaptcha-with-content-security-policy
       *
       * @2021/07/24 - nonce not working so use alternative (e.g., put url in src directly)
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
