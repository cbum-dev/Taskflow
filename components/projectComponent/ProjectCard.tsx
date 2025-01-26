import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

function ProjectCard({projectName,projectDescription}:  {projectName: string;
    projectDescription: string;
  }) {
  return (
    <div>
        <Card className='p-6 shadow-none'>
            <CardTitle>Project : {projectName}</CardTitle>
            <CardDescription>
                {projectDescription}
            </CardDescription>
            <CardContent>
                Project name,etc
            </CardContent>
            <CardFooter>
                this is it
            </CardFooter>
            <Button>CLick to check all the issues</Button>
        </Card>
    </div>
  )
}

export default ProjectCard