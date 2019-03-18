const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const currentUser = require('./currentUser')

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))

const urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser)
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
    }
}))


function formDelete (req, res){
  const name_id = req.params.id
  console.log(`formDelete name_id = ${name_id}`)
  delete tweets[`${name_id}`]
  console.log(tweets)
	res.setHeader("Conetent-Type", 'text/html')
	res.redirect(`/tweets`)
}

function formLogin (req, res){
  res.setHeader("Conetent-Type", 'text/html')
  console.log('formLogin')
  // console.log(tweets)
  res.render('login')
}

function formSession (req, res){
  const username = req.body.username
  console.log(`formSession username : ${username}`)
  const tweetLogin = tweets[`${username}`]
  res.setHeader("Conetent-Type", 'text/html')
  if (tweetLogin){
    // console.log(`All tweets by '${username}'`)
    // for (let i = 0 ; i < tweetLogin.length ; i += 1){
    //   console.log(`${tweetLogin[i]['tweet']} on ${tweetLogin[i]['createdAt']}`)
    // }
    res.render('tweets', {listTweets: tweetLogin, username})
  }else{
    const error = 'User login not found'
    res.render('login', {error})
  }
}

function formSearch (req, res){
  const {qTweet, username} = req.body
  const tweetsKeys = Object.keys(tweets)
  res.setHeader("Conetent-Type", 'text/html')
  for (let i = 0 ; i < tweetsKeys.length ; i += 1){
    let tweetLogin = tweets[`${tweetsKeys[i]}`]
    let obj = tweetLogin.find(o => o.tweet === qTweet)
    if (obj){
      // console.log(obj)
      // console.log(`${tweetsKeys[i]} : ${username}`)
      if (tweetsKeys[i] === username){
        //goto /tweets/:id/edit
        console.log(`formSearch username : ${username}`)
        res.redirect(`/tweets/${username}/edit`)
      }else{
        //goto /tweets/:id
        console.log(`formSearch username : ${tweetsKeys[i]}`)
        res.redirect(`/tweets/${tweetsKeys[i]}`)
      }
      return
    }
  }
  const error = 'Tweet not found'
  res.render('login', {error})
}

function formGetTweet (req, res){
  const {id} = req.params
  console.log(`formGetTweet username : ${id}`)
  const listTweet = tweets[`${id}`]
  res.setHeader("Conetent-Type", 'text/html')
  if (listTweet){
    // console.log(`All tweets by '${id}'`)
    // for (let i = 0 ; i < listTweet.length ; i += 1){
    //   console.log(`${listTweet[i]['tweet']} on ${listTweet[i]['createdAt']}`)
    // }
    res.render('tweetid.pug', {listTweets: listTweet, username: id})
  }
}

function formEdit (req, res){
  const {id} = req.params
  console.log(`formEdit username : ${id}`)
  const listTweet = tweets[`${id}`]
  res.setHeader("Conetent-Type", 'text/html')
  res.render('tweetedit', {listTweets: listTweet, username: id})
}

function editContent (req, res){
  const {id} = req.params
  const {eTweet, eTweetDate} = req.body
  console.log(`editContent username : ${id}`)
  console.log(req.body)
  const listTweet = tweets[`${id}`]
  // console.log(listTweet)
  if(listTweet && listTweet.length > 1){
    for (let i = 0 ; i < listTweet.length ; i += 1){
      listTweet[i]['tweet'] = eTweet[i]
      listTweet[i]['createdAt'] = eTweetDate[i]
    }
  }else{
    listTweet[0]['tweet'] = eTweet
    listTweet[0]['createdAt'] = eTweetDate
}
  // console.log(tweets)
  res.redirect(`/tweets/${id}/edit`)
}

function formNew (req, res){
  res.setHeader("Conetent-Type", 'text/html')
  res.render('new')
}

function newContent (req, res){
  const {username, tweet, createdAt} = req.body
  console.log(`newContent username : ${username}`)
  console.log(req.body)
  const listTweet = tweets[`${username}`]
  if (listTweet){
    listTweet.push({tweet: tweet, createdAt: createdAt})
    console.log(listTweet)
  }else{
    const person = [{tweet: tweet, createdAt: createdAt}];
    tweets[`${username}`] = person
    console.log(tweets)
  }
  res.redirect(`/tweets/${username}/edit`)
}

app.get('/users/login', formLogin)
   .post('/users/session', urlencodedParser, formSession)
   .post('/search', urlencodedParser, formSearch)
   .get('/tweets', urlencodedParser, formSession)
   .get('/tweets/new', formNew)
   .post('/tweets', urlencodedParser, newContent)
   .get('/tweets/:id/edit', formEdit)
   .put('/tweets/:id', urlencodedParser, editContent)
   .delete('/tweets/:id', urlencodedParser, formDelete)
   .get('/tweets/:id', formGetTweet)

const tweets = {
  adam123: [
    {
      tweet: 'Lorem Ipsum1 ...',
      createdAt: '20 Jan 2019'
    },
    {
      tweet: 'Lorem Ipsum2 ...',
      createdAt: '20 Jan 2019'
    }
  ],
  jum: [
    {
      tweet: 'Lorem Ipsum3 ...',
      createdAt: '16 Mar 2019'
    },
    {
      tweet: 'Lorem Ipsum4 ...',
      createdAt: '16 Mar 2019'
    },
    {
      tweet: 'Lorem Ipsum5 ...',
      createdAt: '17 Mar 2019'
    }
  ]
}

app.listen(3000)