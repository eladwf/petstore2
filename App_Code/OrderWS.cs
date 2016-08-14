using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Web.Configuration;

/// <summary>
/// Summary description for OrderWS
/// </summary>
[WebService(Namespace = "http://petshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]
public class OrderWS : System.Web.Services.WebService {

    public OrderWS () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    public int InsertOrder(string UserName,string Phone,string date,string time)
    {
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;

        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        // modify the format depending upon input required in the column in database 
        SqlCommand checkcom = new SqlCommand("SELECT * FROM appointments ", con);
        SqlDataReader reader = checkcom.ExecuteReader();


       
        while (reader.Read())
        {

           var x=reader["date"].ToString();
            var str = x.Substring(0, 16);
            if (str.Equals(date + " " + time))
            return -1;
        }
        con.Close();
        con.Open();
        SqlCommand com = new SqlCommand("INSERT INTO Appointments VALUES('" + UserName + "','" + date+" "+time +"','"+Phone+ "')", con);
      
        int rows = com.ExecuteNonQuery();
        con.Close();            
        return rows;
    }    
}
