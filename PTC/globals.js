//Globales para las extensiones
const SERVER_IP = "localhost";
const SERVER_DIR = "http://"+SERVER_IP;

//Constantes para los mensajes
const MSG_ACTION="action";
const MSG_ROLE="role";
const MSG_MAIL="mail";
const MSG_DOMAIN = "dominio";
const MSG_PASSWD = "password";
const MSG_REQ_ID = "req_id";
const MSG_SERVER_KEY="serverKey";
const MSG_USER = "usuario";
const MSG_STATE = "estado";

//Acciones de los mensajes de GCM
const ACTION_REGISTER = "REGISTER";
const ACTION_CONTAINER = "container";
const ACTION_REGISTERED = "registered";
const ACTION_REQUEST = "request";
const ACTION_RESPONSE = "response";
const ACTION_CLEARNOTIF = "clear_notification";
const ACTION_GET_URLS = "get_urls";
const ACTION_SAVE_PASS = "save_pass";
const ACTION_ADD_PASS = "addpass";

//Constantes para los mensajes entre background y content.
const GCE_LOOKFORFORM = "look_for_form";
const GCE_SAVEUSER = "save_user";
const GCE_FILLFORM = "fill_form";
const GCE_HASFORM = "has_form";
const GCE_REGISTER = "register";
const GCE_REGISTERED = "registered";
const GCE_SHOW_BARRA = "showbarra";
const GCE_SAVE_PASS = "savePasswordGCE";


//Estado de los mensaje de respuesta
const MSG_STATE_OK = "OK";
const MSG_STATE_NO_PASSWD ="noPass";
