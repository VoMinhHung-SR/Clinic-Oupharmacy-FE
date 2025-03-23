import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Loading from "../../../../modules/common/components/Loading";
import useExaminationDetail from "../../../../modules/pages/ExaminationDetailComponents/hooks/useExaminationDetail";

const ExaminationDetail = () => {
  const { t, tReady } = useTranslation(["examination-detail"]);
  const { examinationData, isLoadingExaminationDetail } =
    useExaminationDetail();
  if (isLoadingExaminationDetail)
    return (
      <Box>
        <Loading />
      </Box>
    );
  return (
    <Box className="ou-my-5 ou-mb-8 ou-w-[80%] ou-m-auto ou-max-w-[1280px]">
      <Box>
        <Box>
          <Box className="ou-my-4" component={Paper} elevation={4}>
            <h5 className="ou-text-center ou-text-xl ou-mb-4 ou-pt-4">
              {t("examinationDetailInfo")}
            </h5>
            <Box className="ou-p-4">
              <Grid container>
                <Grid item xs={4} className="ou-pr-2">
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit", marginRight: "20px" }}
                    color="grey.700"
                  >
                    {t("examinationId")}: {examinationData.id}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="ou-pr-2">
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit" }}
                    color="grey.700"
                  >
                    {t("patientFullName")}:{" "}
                    {examinationData.patient.first_name}{" "}
                    {examinationData.patient.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="ou-pr-2">
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit" }}
                    color="grey.700"
                  >
                    {t("createdDate")}:{" "}
                    <span>
                      {moment(examinationData.created_date).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={7}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit", marginRight: "20px" }}
                    color="grey.700"
                    className="ou-truncate"
                  >
                    {t("userCreated")}: {examinationData.user.email}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit" }}
                    color="grey.700"
                  >
                    {t("mailStatus")}:{" "}
                    <span>
                      {examinationData.mail_status ? t("sent") : t("noSend")}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ textDecoration: "inherit" }}
                    color="grey.700"
                  >
                    {t("description")}: {examinationData.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    
    </Box>
  );
};
export default ExaminationDetail;
