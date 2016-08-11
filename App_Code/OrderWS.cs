using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;

/// <summary>
/// Summary description for OrderWS
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]
public class OrderWS : System.Web.Services.WebService {

    public OrderWS () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    public int InsertOrder(string UserName, int Price)
    {
        string conStr = @"Data Source=E440;Initial Catalog=Mobile2013A;Integrated Security=True";
        SqlConnection con = new SqlConnection(conStr);
        SqlCommand com = new SqlCommand("INSERT INTO Orders VALUES('"+ DateTime.Now.ToShortDateString() +"','"+UserName+"',"+Price+")", con);
        com.Connection.Open();
        int rows = com.ExecuteNonQuery();
        com.Connection.Close();            
        return rows;
    }    
}
