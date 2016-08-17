<%@ WebService Language="C#" CodeBehind="~/App_Code/OrderWS.cs" Class="OrderWS" %>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Globalization;

/// <summary>
/// Summary description for OrderWS
/// </summary>
[WebService(Namespace = "http://petshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class OrderWS : System.Web.Services.WebService
{

    public OrderWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    public List<string> InsertOrder(string UserName, string Phone, string date, string shopname,string time)
    {
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;

        List<string> meetings = new List<string>();



        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        // modify the format depending upon input required in the column in database 
        SqlCommand checkcom = new SqlCommand("select * from meetings where shopname='"+shopname+"'", con);
        SqlDataReader reader = checkcom.ExecuteReader();


        DateTime datadate=DateTime.ParseExact(date, "M'/'d'/'yyyy",
                                  new CultureInfo("de-DE"));;

        datadate= datadate.Add(Convert.ToDateTime(time).TimeOfDay);


        bool exist = false;
        TimeSpan ts;

        DateTime DbDate;
        while (reader.Read())
        {


            try
            {
                DbDate = DateTime.Parse(reader["date"].ToString());
            }
            catch (Exception e)
            {
                DbDate = DateTime.Now;
            }



            try
            {
                ts = TimeSpan.Parse(reader["time"].ToString());
            }
            catch (Exception e)
            {
                ts = DateTime.Now.TimeOfDay;
            }


            DbDate = DbDate.Add(ts); //date and time from db

            int result = DateTime.Compare(DbDate,datadate);
            meetings.Add(DbDate.ToString());

            if (result==0)
            {
                exist = true;
            }
        }
        con.Close();
        if (!exist)
        {

            con.Open();
            SqlCommand com = new SqlCommand("INSERT INTO meetings VALUES('" + date + "','" + time + "','" + UserName + "','" + Phone + "','" + shopname + "')", con);

            int rows = com.ExecuteNonQuery();

            con.Close();
            return null;
        }


        return meetings;
    }
}
