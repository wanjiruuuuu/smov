import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { singularProxiedFetch } from "@/backend/helpers/fetch";
import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { Divider } from "@/components/utils/Divider";
import { ErrorLine } from "@/components/utils/ErrorLine";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { useRedirectBack } from "@/pages/onboarding/onboardingHooks";
import { Link } from "@/pages/onboarding/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { useAuthStore } from "@/stores/auth";

const testUrl = "https://postman-echo.com/get";

export function OnboardingProxyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeAndRedirect } = useRedirectBack();
  const [url, setUrl] = useState("");
  const setProxySet = useAuthStore((s) => s.setProxySet);

  const [{ loading, error }, test] = useAsyncFn(async () => {
    if (!url.startsWith("http"))
      throw new Error("onboarding.proxy.input.errorInvalidUrl");
    try {
      const res = await singularProxiedFetch(url, testUrl, {});
      if (res.url !== testUrl)
        throw new Error("onboarding.proxy.input.errorNotProxy");
      setProxySet([url]);
      completeAndRedirect();
    } catch (e) {
      throw new Error("onboarding.proxy.input.errorConnection");
    }
  }, [url, completeAndRedirect, setProxySet]);

  // TODO proper link to proxy deployment docs
  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.onboarding" />
      <CenterContainer>
        <Stepper steps={2} current={2} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          {t("onboarding.proxy.title")}
        </Heading2>
        <Paragraph className="max-w-[320px] !mb-5">
          {t("onboarding.proxy.explainer")}
        </Paragraph>
        <Link>{t("onboarding.proxy.link")}</Link>
        <div className="w-[400px] max-w-full  mt-14 mb-28">
          <AuthInputBox
            label={t("onboarding.proxy.input.label")}
            value={url}
            onChange={setUrl}
            placeholder={t("onboarding.proxy.input.placeholder")}
            className="mb-4"
          />
          {error ? <ErrorLine>{t(error.message)}</ErrorLine> : null}
        </div>
        <Divider />
        <div className="flex justify-between">
          <Button theme="secondary" onClick={() => navigate("/onboarding")}>
            {t("onboarding.proxy.back")}
          </Button>
          <Button theme="purple" loading={loading} onClick={test}>
            {t("onboarding.proxy.submit")}
          </Button>
        </div>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
