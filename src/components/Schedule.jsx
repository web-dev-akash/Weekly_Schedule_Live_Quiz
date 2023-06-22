import { useEffect, useState } from "react";
import "../App.css";
import { Box, Heading } from "@chakra-ui/react";
import logo from "../assets/logo.png";

import axios from "axios";
import { Select } from "@chakra-ui/react";
export const Schedule = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const phone = queryParameters.get("phone");
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [studentGrade, setStudentGrade] = useState("");

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getWeeklySchedule = async () => {
    try {
      const watiAPI = `https://live-server-105694.wati.io`;
      const WATI_TOKEN = process.env.REACT_APP_WATI_TOKEN;
      if (phone && phone.length >= 10) {
        const watiConfig = {
          headers: {
            Authorization: `Bearer ${WATI_TOKEN}`,
          },
        };
        const response = await axios.get(
          `${watiAPI}/api/v1/getContacts?attribute=%5B%7Bname%3A%20%22phone%22%2C%20operator%3A%20%22contain%22%2C%20value%3A%20%22${phone}%22%7D%5D`,
          watiConfig
        );
        if (response.data && response.data.contact_list.length > 0) {
          console.log(response.data);
          const res = response.data.contact_list[0].customParams;
          for (let i = 0; i < res.length; i++) {
            if (res[i].name === "student_grade") {
              setStudentGrade(`Grade ${res[i].value}`);
              break;
            }
          }
        }
      }
      const body = phone && phone.length >= 10 ? { phone: phone } : {};
      setLoading(true);
      const url = "https://wisechamps.onrender.com/weeklySchedule";
      const response = await axios.post(url, body);
      console.log(response.data);
      const storedSchedule = response.data.data;
      setData(storedSchedule);
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  const updateSubject = (e) => {
    const subjectF = e.target.value;
    setSubject(subjectF);

    const filteredData = data.filter((res) => {
      return (
        (subjectF === "" || res.subject === subjectF) &&
        (grade === "" || res.grade === grade)
      );
    });
    setFilteredData(filteredData);
  };

  const updateGrade = (e) => {
    const gradeF = e.target.value;
    setGrade(gradeF);
    const newData = data.filter((res) => {
      return (
        (subject === "" || res.subject === subject) &&
        (gradeF === "" || res.grade === gradeF)
      );
    });
    setFilteredData(newData);
  };

  console.log(studentGrade);

  useEffect(() => {
    getWeeklySchedule();
  }, []);

  if (loading) {
    return (
      <div id="loading">
        <div role="img" className="wheel-and-hamster">
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">OOPS!</h1>
                </div>
                <div className="contant_box_404">
                  <h3>The page is not avaible!</h3>
                  <p>Please refresh & try again</p>
                  <button
                    className="link_404"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={
        filteredData && filteredData.length === 0 ? "overflowHidden" : ""
      }
    >
      <header
        style={{
          padding: "0 20px",
          margin: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="logo" width={"120px"} />
        <p
          className="heading"
          style={{
            fontSize: "18px",
            fontWeight: "600",
            background: "#0ba732",
            color: "white",
            padding: "5px 8px",
            borderRadius: "5px",
          }}
        >
          Weekly Schedule
        </p>
      </header>
      <Box
        width={{ base: "90%", md: "80%", lg: "70%" }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          margin: "20px auto 0px auto",
        }}
      >
        <Select
          variant="filled"
          placeholder="Select Subject"
          fontSize={"15px"}
          onChange={(e) => updateSubject(e)}
        >
          <option value="">All Subjects</option>
          <option value="Math">Maths</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="GK">GK</option>
        </Select>
        <Select
          variant="filled"
          placeholder="Select Grade"
          fontSize={"15px"}
          onChange={(e) => updateGrade(e)}
        >
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
        </Select>
      </Box>
      <div className="weeklydata">
        {filteredData && filteredData.length === 0 && (
          <div className="noSchedule">
            <p>Schedule not available for {grade}.</p>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="scheduleCards">
            {(filteredData.length > 0 ? filteredData : data).map((row, index) =>
              !studentGrade || grade === row.grade ? (
                <div className="scheduleCard" key={index}>
                  <div className="scheduleCardContent">
                    <Heading
                      as={"h4"}
                      fontSize={{ base: "18px", md: "25px", lg: "30px" }}
                    >
                      {row.subject} {"  "}
                      <span className="grade">{row.grade}</span>
                    </Heading>
                    <p>Topic : {row.topic}</p>
                    <p>
                      Day : {row.day},{" "}
                      {`${new Date(row.timestamp * 1000).getDate()} ${
                        month[new Date(row.timestamp * 1000).getMonth()]
                      } ${new Date(row.timestamp * 1000).getFullYear()}`}
                    </p>
                    <p>Time : {row.time}</p>
                  </div>
                </div>
              ) : (
                studentGrade === row.grade && (
                  <div className="scheduleCard" key={index}>
                    <div className="scheduleCardContent">
                      <Heading
                        as={"h4"}
                        fontSize={{ base: "18px", md: "25px", lg: "30px" }}
                      >
                        {row.subject} {"  "}
                        <span className="grade">{row.grade}</span>
                      </Heading>
                      <p>Topic : {row.topic}</p>
                      <p>
                        Day : {row.day},{" "}
                        {`${new Date(row.timestamp * 1000).getDate()} ${
                          month[new Date(row.timestamp * 1000).getMonth()]
                        } ${new Date(row.timestamp * 1000).getFullYear()}`}
                      </p>
                      <p>Time : {row.time}</p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>
      <div className="joinNow">
        <a href="https://wisechamps.app/" target="_blank" rel="noreferrer">
          Join Now
        </a>
      </div>
    </div>
  );
};
