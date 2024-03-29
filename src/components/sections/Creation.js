import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { firebase } from '../../firebase';
import { getDatabase, ref, set, get, child } from "firebase/database";
import {isMobile} from 'react-device-detect';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Image from '../elements/Image'
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from "react-router-dom";
const axios = require('axios').default;
const db = getDatabase(firebase)

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Creation = (props) => {
    const [open, setOpen] = React.useState(false);
    const [layout, setLayout] = React.useState(isMobile?"column":"row")
    const [name, setName] = React.useState("")
    const [token, setToken] = React.useState("")
    const [modalTitle, setModalTitle] = React.useState("")
    const [modalText, setModalText] = React.useState("")
    const history = useHistory()
    const [bots, setBots] = React.useState([{name: 'Sample Bot', status: 'Active', bought: false}, {name: 'Another Example', status: 'Paused', bought: false}])
    React.useEffect(()=>{
        const dbRef = ref(db);
        get(child(dbRef, `users/${props.user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
              let names = Object.keys(snapshot.val())
              let list=[]
              names.forEach(name=>{
                  list.push({name: name, status: snapshot.val()[name].status, bought: true})
              })
            setBots(list);
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
    }, [props.user.uid])
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSuccess = (projName) => {
        setModalTitle("Bot Created 🥳")
        setModalText("Congratulations, "+projName+" has been created! Now go to a server with your bot in it and use /help to get to know your new creation!")
        setName("")
        setToken("")
        handleOpen()
    }
    const handleFailure = (msg) => {
        setModalTitle("Something Went Wrong ☹️")
        setModalText(msg)
        handleOpen()
    }
    return (
        <div style={{display: 'flex',  flexDirection: 'column', height: 'auto', width: 'auto', alignItems: 'center', justifyContent: 'center'}}>
            <h1 style={{textAlign: 'center'}}>Welcome back, {props.user.email.split("@")[0]}!</h1>
            <p style={{fontSize: 25}}>What would you like to do today?</p>
            <div style={{display:'flex', flexDirection: layout}}>
                <div style={{display: 'flex',  flexDirection: 'column',alignItems: 'center', justifyContent: 'center', height: 'auto', width: 'auto', borderRadius: '15px', paddingLeft: '3vw', paddingRight: '3vw'}}>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                                {modalTitle}
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }} color="black">
                                {modalText}
                            </Typography>
                        </Box>
                    </Modal>
                    <div>
                        <Image
                        className="has-shadow"
                        src={require('./../../assets/images/Create.png')}
                        alt="Hero"
                        width={128}
                        height={128} />
                    </div> 
                    <h2> Create a New Bot </h2>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    {/* <Checkbox style={{alignSelf: 'center'}}/> */}
                    <p style={{textAlign: 'center', alignSelf: 'center'}}>By creating a bot, you agree to our <a href="#/toc" target="_blank" rel="noreferrer noopener" style={{marginBottom: '2vh', color: 'blue', textDecorationLine: 'underline'}}>terms and conditions</a> and <a href="#/privacy" target="_blank" rel="noreferrer noopener" style={{marginBottom: '2vh', color: 'blue', textDecorationLine: 'underline'}}>privacy policy</a>.</p>
                    </div>
                    <TextField fullWidth style={{marginBottom: '3vh', borderRadius: '15px', backgroundColor: '#d1d1d1'}} value={name} onChange={(e)=>{setName(e.target.value)}} label="Project Name" variant="outlined" color="secondary"/>
                    <Button color="success" onClick ={()=>{
                        if(name.length>0){
                            get(child(ref(db), 'users/' + props.user.uid + "/" + name)).then((snapshot) => {
                                if(snapshot.exists()){
                                    handleFailure("A project already exists under that name!")
                                } else {
                                     axios.post('https://botink.franklinyin.com/pay/create-checkout-session', {subPrice: 499, subQuantity: 1, email: props.user.email, metadata: {uid: props.user.uid},
                                     projName: name.replaceAll(" ", "-")})
                                     .then(res => {
                                         window.location = res.data.url
                                         if(res.ok) return res.json()
                                     })
                                     .catch(err=>{
                                         handleFailure(err.message)
                                     })
                                }
                            })
                        } else{
                            handleFailure("Your project must have a name!")
                        }
                    }} style = {{marginBottom: '3vh', padding:'3%'}} variant="contained">Continue</Button>
                </div>
                <h4 style={{display: 'flex',  flexDirection: 'column', height: 'auto', width: 'auto', alignItems: 'center', justifyContent: 'center'}}>or...</h4>
                <div style={{display: 'flex', flexDirection: 'column', height: isMobile?'75vh':'50vh', width: 'auto', borderRadius: '15px', paddingLeft: '3vw', paddingRight: '3vw', alignItems: 'center', justifyContent: 'center'}}>
                    <div>
                        <Image
                        className="has-shadow"
                        src={require('./../../assets/images/Edit.png')}
                        alt="Hero"
                        width={128}
                        height={128} />
                    </div> 
                    <h2>Edit Your Existing Bots</h2>
                    <List style={{height: '100%', width: '100%', overflow: 'auto', paddingRight: '2%'}}>
                        {bots.map(el=>{
                            return (<ListItem
                            secondaryAction={
                                <IconButton style={{backgroundColor: 'white'}} edge="end" aria-label="edit" onClick={()=>{
                                    if(!el.bought)
                                        alert('Create a bot to see it here and customize it!')
                                    else
                                        history.push('/edit/'+props.user.uid+'/'+el.name)
                                }}>
                                <EditIcon />
                                </IconButton>
                            }
                            >
                            {/* <ListItemAvatar>
                                <Avatar>
                                <FolderIcon />
                                </Avatar>
                            </ListItemAvatar> */}
                            <ListItemText
                                disableTypography
                                primary={<Typography type="body2" style={{ color: '#6f54f7', fontSize:20 }}>{el.name}</Typography>}
                                secondary={<p style={{ color: '#FFFFFF' }}>Status: {el.status}</p>}
                            />
                            </ListItem>)
                        })}
                    </List>
                </div>
            </div>
            <Button color="secondary" variant='contained' style={{padding: '13px'}} onClick={()=>{props.signOut(props.auth).then(()=>{ window.location.reload(false);})}}> Sign Out </Button>
        </div>
    );
}

export default Creation;