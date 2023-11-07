const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const app = express();

// Initialize Express session
app.use(require('express-session')({ secret: secret, resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure the SAML strategy
passport.use(new SamlStrategy(
  {
    path: 'https://sso-appv1-frontend-9izzgihx6-malinda-s-projects.vercel.app/dashboard', // Update with your callback path
    entryPoint: 'http://localhost:8080/auth/realms/SSOTEST/protocol/saml',
    issuer: 'webapp1',
    cert: 'MIICnzCCAYcCBgGLhzo+LDANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAhCbG9nc2l0ZTAeFw0yMzEwMzExOTMyMDNaFw0zMzEwMzExOTMzNDNaMBMxETAPBgNVBAMMCEJsb2dzaXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3HABsQ2TgS65jfaHfm8edMr0YmykDIrokRff0clse9E3KfHVvgzqZwN69vdfNaZc/gJUCgicbjE+XA6bUsuHsDtGIcZwwhmcBrQDpEwFsKSQXDMhwwXThrTbB2XU5u9UYPOiWJPHAEGQukl8RzHj+OuZADEsBVAH0fOhXJ8wZ8JIxLeOAbVxhnGG+M6WTrEvNrm+NGjFhcglfteFqcz1BpoAeVUbI+INgI/HIIEJ0bXNHisntYHiqVOEQPe3oZazLrcLsF9P5zZf092n4JWRT9ufrTxGzRUcSmqq0EHtXPjKmwBv0Y9NV0CCRqJl0VRw/vRDuslrDAHcTvYmb5QSawIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAYk4uz5VNpictoZpNVwJbH5cR2TZTQ221X+cMIIfWzU5puYcBxR4er359UoFhid9H0Y9uxPNe01drCxNh3BBpr6jP5nKAbwEncyh3kVjmBR0XtL3ywdGw+pOayOlf6AFwj7LkeSRKQR/nEzjeRFWrhFNL9GxvMl7Ez9kSsHJ4WrnLpqsWUd2Vvr1rWfLI4sO35NOqwvT3JzU7aM1+v16zPA9sh5aKkrthxluH3Nc5HuImT0n3JAwZnvzq+eouGya1zToc9Hot/ym9yR1X/XDZ0B16Zchlx5MSZJeBSZAUCgv2hXYXJfaoyKBOjKZ5bVTOnDjm7ToZ/zxk1vXTDCSUW'
  },
  (profile, done) => {
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define your login and callback routes
app.get('https://sso-appv1-frontend-9izzgihx6-malinda-s-projects.vercel.app', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  res.redirect('/');
});

app.post('https://sso-appv1-frontend-9izzgihx6-malinda-s-projects.vercel.app/dashboard', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? 'Logged in' : 'Not logged in');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});