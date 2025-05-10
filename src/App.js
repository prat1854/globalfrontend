import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../src/components/userinterface/homepage';
import Login from '../src/components/userinterface/login';
import ResetPassword from './components/userinterface/ResetPassword';
import SignUp from './components/userinterface/SignUp';
import Contact from './components/userinterface/contact';
import Header from './components/userinterface/Header';
import About from './components/userinterface/about';
import MyProfile from './components/userinterface/MyProfile';
import EditProfile from './components/userinterface/EditProfile';
import TitleSubmission from './components/userinterface/TitleSubmission';
import SubmissionDetail from './components/userinterface/SubmissionDetail';
import SubmissionUpload from './components/userinterface/SubmissionUpload';
import SubmissionContributors from './components/userinterface/SubmissionContributors';
import SubmissionEditors from './components/userinterface/SubmissionEditors';
import SubmissionReview from './components/userinterface/SubmissionReview';
import AuthorGuidelines from './components/userinterface/AuthorGuidelines';
import SubmissionTemplate from './components/userinterface/SubmissionTemplate';
import EditorialTeam from './components/userinterface/EditorialTeam';
import ResearchEthicsGuidelines from './components/userinterface/ResearchEthicsGuidelines';
import Submissions from './components/userinterface/Submissions';
import Announcements from './components/userinterface/Announcements';
import Current from './components/userinterface/issues/Current';
import Archive from './components/userinterface/issues/Archive';
import SetNewPassword from './components/SetNewPassword';


function App() {
  return (
    <div>
      <Router>
        {/* Header is included globally for all routes
         */}
         <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/titlesubmission" element={<TitleSubmission />} />
          <Route path="/submission-detail" element={<SubmissionDetail />} />
          <Route path="/submission-detail/:submissionId" element={<SubmissionDetail />} />
          <Route path="/submission-upload" element={<SubmissionUpload />} />
          <Route path="/submission-contributors" element={<SubmissionContributors />} />
          <Route path="/submission-editors" element={<SubmissionEditors />} />
          <Route path="/submission-review" element={<SubmissionReview />} />
          <Route path="/editorial-team" element={<EditorialTeam />} />
          <Route path="/author-guidelines" element={<AuthorGuidelines />} />
          <Route path="/submission-template" element={<SubmissionTemplate />} />
          <Route path="/research-ethics-guidelines" element={<ResearchEthicsGuidelines />} />
          <Route path="/AuthorGuidelines" element={<AuthorGuidelines />} />
          <Route path="/SubmissionTemplate" element={<SubmissionTemplate />} />
          <Route path="/ResearchEthicsGuidelines" element={<ResearchEthicsGuidelines />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/issues/current" element={<Current />} />
          <Route path="/issues/archive" element={<Archive />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;