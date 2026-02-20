import React from "react";
import { Card } from "react-bootstrap";

const SnippetCard = ({ title, description, language, createdAt, children }) => {
  return (
    <Card className="border-0 mb-4 snippet-card">
      <Card.Body>
        <div className="snippet-card-header mb-1">
          <div>
            <Card.Title className="snippet-card-title mb-1">
              {title}
            </Card.Title>
            {language && (
              <span className="snippet-card-language">
                <span className="snippet-card-language-dot" />
                <span>{language}</span>
              </span>
            )}
          </div>
          {createdAt && (
            <small className="snippet-card-meta">{createdAt}</small>
          )}
        </div>

        <Card.Text className="snippet-card-body">
          {description}
        </Card.Text>

        {children && (
          <div className="snippet-card-footer">
            {children}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SnippetCard;
