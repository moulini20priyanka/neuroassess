import { useNavigate } from "react-router-dom";

export default function AdminDashboard(){

  const navigate = useNavigate();

  return(

    <div style={styles.container}>

      <h1>Admin Dashboard</h1>

      <div style={styles.grid}>

        <div style={styles.card}>
          <h3>Manage Exams</h3>
          <p>Create and monitor exams</p>
        </div>

        <div style={styles.card}>
          <h3>Students</h3>
          <p>View registered students</p>
        </div>

        <div style={styles.card}>
          <h3>Proctoring Logs</h3>
          <p>See cheating alerts</p>
        </div>

        <div style={styles.card}>
          <h3>System Settings</h3>
          <p>Control exam rules</p>
        </div>

      </div>

      <button style={styles.logout}
        onClick={()=>navigate("/")}>
        Logout
      </button>

    </div>

  )

}

const styles = {

container:{
  minHeight:"100vh",
  background:"#07090f",
  color:"#fff",
  padding:"40px"
},

grid:{
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
  gap:"20px",
  marginTop:"30px"
},

card:{
  background:"rgba(255,255,255,0.05)",
  padding:"20px",
  borderRadius:"12px",
  border:"1px solid rgba(255,255,255,0.08)"
},

logout:{
  marginTop:"40px",
  padding:"10px 18px",
  border:"none",
  borderRadius:"8px",
  background:"#4f8bff",
  color:"#fff"
}

}