import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

function ProjectCard({projectName,projectDescription}:  {projectName: string;
    projectDescription: string;
  }) {
  return (
    <div>
        <Card  className='p-6 w-1/4 shadow-none'>
            <CardTitle>Project : {projectName}</CardTitle>
            <CardDescription>
                {projectDescription}
            </CardDescription>
        </Card>
    </div>
  )
}

export default ProjectCard