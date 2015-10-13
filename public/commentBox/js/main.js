'use strict';

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: []
    };
  },
  loadComments: function () {
    fetch(this.props.url).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      if (data.no == 0) {
        this.setState({data: data.data});
      }
    }.bind(this)).catch(function (err) {
      console.log(err.stack);
    });
  },
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    var newComments = [comment].concat(comments);
    this.setState({ data: newComments });
    fetch(this.props.url, {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
    });
  },
  componentDidMount: function () {
    this.loadComments();
    setInterval(this.loadComments, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>评论</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!author || !text) {
      return;
    }
    this.props.onCommentSubmit({
      author: author,
      text: text
    });
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="昵称" ref="author" />
        <input type="text" placeholder="说点啥吧" ref="text" />
        <input type="submit" value="提交评论" />
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function () {
    var rawMarkup = '';
    if (this.props.children) {
      rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    }
    return { __html: rawMarkup };
  },
  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
