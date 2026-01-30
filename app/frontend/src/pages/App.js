import { useState, useMemo } from "react";
import { Oval } from "react-loader-spinner";
import { CSVLink } from "react-csv";

import styles from "./App.module.css";
import SimpleAreaChart from "../components/data-display/SimpleAreaChart.js";
import { getCPUUtilizationMetric } from "../http/requests.js";
import isValidForm from "../utils/validators.js";
import StatItem from "../components/data-display/StatItem.js";

const initialFormData = {
  ipAddress: "",
  startDate: "",
  endDate: "",
  timeInterval: "",
};

const initialValidation = {
  ipAddress: { valid: true, message: "" },
  startDate: { valid: true, message: "" },
  endDate: { valid: true, message: "" },
  timeRange: { valid: true, message: "" },
  timeInterval: { valid: true, message: "" },
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [formValidation, setFormValidation] = useState(initialValidation);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputFieldClass = (isValid) => {
    if (!isValid) {
      return styles.invalid;
    }

    return "";
  };

  const onChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    setFormValidation((prev) => {
      return {
        ...prev,
        [name]: { valid: true, message: "" },
        ...(name === "startDate" || name === "endDate"
          ? { timeRange: { valid: true, message: "" } }
          : {}),
      };
    });
  };

  const onSubmitForm = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setData(null);

      const validation = isValidForm(formData);
      console.log(formData);
      console.log(validation);

      setFormValidation((prev) => validation);

      const hasErrors = Object.values(validation).some((v) => !v.valid);
      if (hasErrors) return;

      const response = await getCPUUtilizationMetric(formData);
      if (!response || !response.success) {
        setErrorMessage(response.message || "");
        return;
      }

      setData(response.metrics);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const csvFileInputs = useMemo(() => {
    if (!data || !data.timestamps || !data.values) return null;
    const headersInput = [];
    const dataInput = [];

    for (let i = 0; i < data.timestamps.length; i++) {
      dataInput.push({
        timestamp: data.timestamps.at(i),
        CPU_usage: data.values.at(i),
      });
    }

    headersInput.push({ label: "timestamp", key: "timestamp" });
    headersInput.push({ label: "CPU_usage", key: "CPU_usage" });

    console.log(dataInput);

    return {
      data: dataInput,
      headers: headersInput,
      filename: "CPU-Utilization.csv",
    };
  }, [data]);

  return (
    <>
      <title>CPU Monitor</title>
      <header>
        <nav className={styles.navbarContainer}>
          <div className={styles.logo}>
            <div className={styles.logoDot}></div>
            <p>CPU Monitor</p>
          </div>
        </nav>
      </header>

      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.formContainer}>
            <div className={styles.formHeaderContainer}>
              <h4>Details</h4>
              <p>Choose IP address, time range and time interval (min)</p>
            </div>
            <div className={styles.formContent}>
              <form>
                <div className={styles.optionInputContainer}>
                  <label htmlFor="ip-address">IP Address</label>
                  <input
                    id="ip-address"
                    type="text"
                    name="ipAddress"
                    placeholder="172.00.00.000"
                    value={formData.ipAddress}
                    onChange={onChangeForm}
                    required
                    className={inputFieldClass(formValidation.ipAddress.valid)}
                  />
                  {!formValidation.ipAddress.valid && (
                    <p className={styles.validationErrorMsg}>
                      {formValidation.ipAddress.message}
                    </p>
                  )}
                </div>
                <div className={styles.timeRangeInputs}>
                  <div className={styles.optionInputContainer}>
                    <label htmlFor="start-date">Start Time</label>
                    <input
                      id="start-date"
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={onChangeForm}
                      required
                      className={inputFieldClass(
                        formValidation.startDate.valid &&
                          formValidation.timeRange.valid,
                      )}
                    />
                    {!formValidation.startDate.valid && (
                      <p className={styles.validationErrorMsg}>
                        {formValidation.startDate.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.optionInputContainer}>
                    <label htmlFor="end-date">End Time</label>
                    <input
                      id="end-date"
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={onChangeForm}
                      required
                      className={inputFieldClass(
                        formValidation.endDate.valid &&
                          formValidation.timeRange.valid,
                      )}
                    />
                    {!formValidation.endDate.valid && (
                      <p className={styles.validationErrorMsg}>
                        {formValidation.endDate.message}
                      </p>
                    )}
                    {!formValidation.timeRange.valid && (
                      <p className={styles.validationErrorMsg}>
                        {formValidation.timeRange.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.optionInputContainer}>
                  <label htmlFor="time-interval">Time Interval (min)</label>
                  <input
                    id="time-interval"
                    type="number"
                    name="timeInterval"
                    value={formData.timeInterval}
                    onChange={onChangeForm}
                    required
                    className={inputFieldClass(
                      formValidation.timeInterval.valid,
                    )}
                  />
                  {!formValidation.timeInterval.valid && (
                    <p className={styles.validationErrorMsg}>
                      {formValidation.timeInterval.message}
                    </p>
                  )}
                </div>
                <div className={styles.submitButtonContainer}>
                  <button
                    className={styles.submitButton}
                    onClick={onSubmitForm}
                    type="button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Fetching..." : "Fetch Data"}
                  </button>
                </div>
              </form>
            </div>
            {errorMessage && (
              <div className={styles.errorMessageContainer}>
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
          <div className={styles.statisticsContainer}>
            <div className={styles.formHeaderContainer}>
              <h4>CPU Utilization</h4>
              <p>Area chart of CPU usage (%) / time range</p>
            </div>
            {isLoading ? (
              <Oval
                visible={true}
                height="80"
                width="80"
                color="#0253ff"
                secondaryColor="#d5e4ff"
                ariaLabel="oval-loading"
                wrapperClass={styles.loaderWrapper}
              />
            ) : (
              data && (
                <div className={styles.statContent}>
                  <div className={styles.graphContainer}>
                    <SimpleAreaChart data={data} />
                  </div>
                  <div className={styles.additionalDataContainer}>
                    <div className={styles.statsContainer}>
                      <StatItem text={"Min"} percentage={data.min} />
                      <StatItem text={"Avg"} percentage={data.avg} />
                      <StatItem text={"Max"} percentage={data.max} />
                    </div>
                    {csvFileInputs && (
                      <CSVLink
                        {...csvFileInputs}
                        className={styles.downloadButton}
                      >
                        Download CSV
                      </CSVLink>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
