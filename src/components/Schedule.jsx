import { useEffect, useState } from "react";
import "../App.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
export const Schedule = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const phone = queryParameters.get("phone");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const day = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getWeeklySchedule = async () => {
    try {
      if (!phone || phone.length < 10) {
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(true);
      const url = `https://wisechamps.onrender.com/getWeeklySchedule?phone=${phone}`;
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.status === "error" ||
            res.status === "User not found with this number"
          ) {
            setError(true);
            setLoading(false);
          }
          const sortedData = res.data.sort((a, b) => a.time - b.time);
          setData(sortedData);
          setLoading(false);
          return;
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
        });
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

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
    <ChakraProvider>
      <div className="weeklydata">
        {data && data.length > 0 ? (
          <TableContainer border={"1px solid"} borderRadius={"10px"}>
            <Table size={{ base: "sm", md: "md", lg: "lg" }}>
              <Thead className="tableHead">
                <Tr>
                  <Th>Subject</Th>
                  <Th>Topic</Th>
                  <Th>Date</Th>
                  <Th>Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, index) => (
                  <Tr key={index}>
                    <Td>
                      {row.subject === "Math" ? "Mathematics" : row.subject}
                    </Td>
                    <Td>{row.name}</Td>
                    <Td>{day[new Date(row.time * 1000).getDay() - 1]}</Td>
                    <Td>{new Date(row.time * 1000).toLocaleTimeString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <div className="noSchedule">
            <p>Schedule not available yet.</p>
            <p>Please retry after sometime.</p>
          </div>
        )}
      </div>
    </ChakraProvider>
  );
};
