var argon=require('argon2')     
argon.verify('$argon2i$v=19$m=4096,t=3,p=1$lmDCJBpd4qdwxuOMb/o1zA$DHszhRtnYSGT89MDFQeuyu3vv64HNobQtNqlSaR2T/c','123456789').then((hash)=>{
    console.log(hash)
})
argon.hash('123456789').then((pas)=>{
    console.log(pas)
})