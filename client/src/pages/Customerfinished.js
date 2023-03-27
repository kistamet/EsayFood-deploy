import React from "react";
import CustomersLayout from "../components/CustomersLayout";
import { Card, CardContent, Typography, Button } from "@mui/material";

function Customerfinished() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#F5F5F5",
          fontSize: "20px",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: "20px", textAlign: "center" }}>
            ขอบคุณที่ใช้บริการ
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Customerfinished;
