﻿import React, { Component, Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Spinner, Alert } from "react-bootstrap";
import ProjectNav from "../Projects/ProjectNav";
import { ProjectEditModal } from "../Projects/ProjectEditModal";
import environment from "../../graphql/environment";
import { AddProjectMutation } from "../../graphql/mutations/Mutations";
import "./SideNav.scss";

const ProjectsQuery = graphql`
  query SideNavProjectsQuery {
    projects {
      ...ProjectNav_projects
    }
  }
`;

class SideNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProjectModal: false
    };
  }

  handleAddProjectClick = () => {
    this.setState({ showAddProjectModal: true });
  }

  handleHideAddProjectModal = () => {
    this.setState({ showAddProjectModal: false });
  };

  handleSaveAddProject = (project) => {
    AddProjectMutation(project.name, project.description, project.deadline, (projectId) => {
      console.log(`Project ${projectId} created`);
      this.handleHideAddProjectModal();
      setTimeout(() => { 
        this.props.history.push(`/project/${projectId}`);
      }, 500);
    });
  };

  render() {
    return (
      <Fragment>
        {this.state.showAddProjectModal &&
          <ProjectEditModal
            onCancelClick={this.handleHideAddProjectModal}
            onSaveClick={this.handleSaveAddProject}
          />
        }
        <div className="bg-light border-right" id="sidebar-wrapper">
          <div className="sidebar-heading">Todo App</div>
            <div className="list-group list-group-flush">
              <NavLink to="/all" className="list-group-item list-group-item-action bg-light">
                All tasks
              </NavLink>
              <QueryRenderer 
                environment={environment}
                query={ProjectsQuery}
                render={({ error, props }) => {
                  if (error) {
                    return (
                      <Alert className="mt-3" variant="danger">
                        <Alert.Heading>Error occured</Alert.Heading>
                        <code>Error message: {error.message}</code>
                      </Alert>
                    )
                  }
                  if (props) {
                    return <ProjectNav projects={props.projects} onAddProjectClick={this.handleAddProjectClick} />
                  }
                  return (<div className="text-center mt-3"><Spinner animation="grow" /></div>)
                }}
              />
            </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(SideNav);
